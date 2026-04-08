<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/PHPMailer/src/Exception.php';
require __DIR__ . '/vendor/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/vendor/PHPMailer/src/SMTP.php';

$config = require __DIR__ . '/mail-config.php';

date_default_timezone_set($config['timezone'] ?? 'UTC');

function wantsJsonResponse(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $requestedWith = strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '');

    return strpos($accept, 'application/json') !== false || $requestedWith === 'xmlhttprequest';
}

function respond(bool $ok, string $status, string $message, int $httpCode = 200): never
{
    if (wantsJsonResponse()) {
        http_response_code($httpCode);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'ok' => $ok,
            'status' => $status,
            'message' => $message,
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    header('Location: index.html?contact=' . rawurlencode($status) . '#contact-section', true, 303);
    exit;
}

function limitText(string $value, int $maxLength): string
{
    $value = trim(preg_replace('/\s+/u', ' ', $value) ?? '');
    $value = str_replace(["\r", "\n"], ' ', $value);

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }

    return substr($value, 0, $maxLength);
}

function limitMessage(string $value, int $maxLength): string
{
    $value = trim(str_replace(["\r\n", "\r"], "\n", $value));
    $value = preg_replace("/\n{3,}/", "\n\n", $value) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }

    return substr($value, 0, $maxLength);
}

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function logMailError(string $message): void
{
    $line = sprintf("[%s] %s\n", date('c'), $message);
    @file_put_contents(__DIR__ . '/contact-mail.log', $line, FILE_APPEND);
}

function buildMailer(
    array $smtp,
    string $smtpUsername,
    string $smtpPassword,
    string $smtpFromEmail,
    string $smtpFromName,
    string $host,
    int $port,
    string $secure
): PHPMailer {
    $mailer = new PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = $host;
    $mailer->SMTPAuth = true;
    $mailer->Username = $smtpUsername;
    $mailer->Password = $smtpPassword;
    $mailer->SMTPSecure = $secure;
    $mailer->Port = $port;
    $mailer->CharSet = 'UTF-8';
    $mailer->Timeout = 20;
    $mailer->setFrom($smtpFromEmail, $smtpFromName);
    $mailer->SMTPAutoTLS = true;
    $mailer->SMTPKeepAlive = false;

    if (!empty($smtp['debug']) && !empty($smtp['debug_log'])) {
        $debugLogPath = __DIR__ . '/' . ltrim((string) $smtp['debug_log'], '/\\');
        $mailer->SMTPDebug = 2;
        $mailer->Debugoutput = static function (string $message, int $level) use ($debugLogPath): void {
            $line = sprintf("[%s] SMTP[%d] %s\n", date('c'), $level, trim($message));
            @file_put_contents($debugLogPath, $line, FILE_APPEND);
        };
    }

    return $mailer;
}

function sendViaConfiguredSmtp(
    callable $configureMessage,
    array $smtp,
    string $smtpUsername,
    string $smtpPassword,
    string $smtpFromEmail,
    string $smtpFromName,
    string $logPrefix
): void {
    $host = trim((string) ($smtp['host'] ?? 'smtp.gmail.com'));
    $attempts = [];
    $configuredPort = (int) ($smtp['port'] ?? 587);
    $configuredSecure = trim((string) ($smtp['secure'] ?? 'tls'));

    if ($configuredPort > 0 && $configuredSecure !== '') {
        $attempts[] = [$host, $configuredPort, $configuredSecure];
    }

    $fallbacks = [
        [$host, 587, 'tls'],
        [$host, 465, 'ssl'],
    ];

    foreach ($fallbacks as $fallback) {
        $alreadyQueued = false;
        foreach ($attempts as $attempt) {
            if ($attempt[0] === $fallback[0] && $attempt[1] === $fallback[1] && $attempt[2] === $fallback[2]) {
                $alreadyQueued = true;
                break;
            }
        }

        if (!$alreadyQueued) {
            $attempts[] = $fallback;
        }
    }

    $errors = [];

    foreach ($attempts as [$attemptHost, $attemptPort, $attemptSecure]) {
        try {
            $mailer = buildMailer(
                $smtp,
                $smtpUsername,
                $smtpPassword,
                $smtpFromEmail,
                $smtpFromName,
                $attemptHost,
                $attemptPort,
                $attemptSecure
            );

            $configureMessage($mailer);
            $mailer->send();
            return;
        } catch (Exception $exception) {
            $errors[] = sprintf('%s:%d/%s -> %s', $attemptHost, $attemptPort, $attemptSecure, $exception->getMessage());
        }
    }

    logMailError($logPrefix . ' failed. Attempts: ' . implode(' | ', $errors));
    throw new Exception($logPrefix . ' failed.');
}

function enforceRateLimit(array $config): void
{
    $security = $config['security'] ?? [];
    $window = (int) ($security['rate_limit_window_seconds'] ?? 900);
    $maxAttempts = (int) ($security['rate_limit_max_attempts'] ?? 3);
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $storageDir = __DIR__ . '/storage';
    $storageFile = $storageDir . '/contact-rate-limit.json';
    $now = time();

    if (!is_dir($storageDir) && !@mkdir($storageDir, 0755, true) && !is_dir($storageDir)) {
        return;
    }

    $raw = @file_get_contents($storageFile);
    $entries = [];

    if (is_string($raw) && $raw !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $entries = $decoded;
        }
    }

    foreach ($entries as $entryIp => $timestamps) {
        $entries[$entryIp] = array_values(array_filter((array) $timestamps, static function ($timestamp) use ($now, $window): bool {
            return is_int($timestamp) && $timestamp > ($now - $window);
        }));

        if ($entries[$entryIp] === []) {
            unset($entries[$entryIp]);
        }
    }

    $attempts = $entries[$ip] ?? [];

    if (count($attempts) >= $maxAttempts) {
        respond(false, 'rate_limit', 'Too many messages were sent recently. Please wait a few minutes and try again.', 429);
    }

    $attempts[] = $now;
    $entries[$ip] = $attempts;
    @file_put_contents($storageFile, json_encode($entries, JSON_PRETTY_PRINT), LOCK_EX);
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond(false, 'error', 'Invalid request method.', 405);
}

$honeypot = trim((string) ($_POST['company'] ?? ''));

if ($honeypot !== '') {
    respond(true, 'success', 'Your message was received.');
}

$startedAt = (int) ($_POST['form_started_at'] ?? 0);
$minimumSubmitSeconds = (int) (($config['security'] ?? [])['minimum_submit_seconds'] ?? 3);

if ($startedAt > 0 && (time() - $startedAt) < $minimumSubmitSeconds) {
    respond(false, 'validation', 'Please wait a few seconds before sending the form.', 422);
}

enforceRateLimit($config);

$name = limitText((string) ($_POST['name'] ?? ''), 120);
$email = limitText((string) ($_POST['email'] ?? ''), 160);
$subject = limitText((string) ($_POST['subject'] ?? ''), 160);
$message = limitMessage((string) ($_POST['message'] ?? ''), 4000);

if ($name === '' || $email === '' || $message === '') {
    respond(false, 'validation', 'Please complete your name, email, and message before sending.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'validation', 'Please enter a valid email address.', 422);
}

if ($subject === '') {
    $subject = 'Website inquiry';
}

$siteName = (string) (($config['site'] ?? [])['name'] ?? 'Portfolio Website');
$publicEmail = (string) (($config['site'] ?? [])['public_email'] ?? '');
$notificationEmail = (string) (($config['site'] ?? [])['notification_email'] ?? '');
$notificationName = (string) (($config['site'] ?? [])['notification_name'] ?? $siteName);
$smtp = $config['smtp'] ?? [];
$smtpUsername = trim((string) ($smtp['username'] ?? ''));
$smtpPassword = str_replace(' ', '', trim((string) ($smtp['password'] ?? '')));
$smtpFromEmail = trim((string) ($smtp['from_email'] ?? ''));
$smtpFromName = trim((string) ($smtp['from_name'] ?? $siteName));

if ($notificationEmail === '' || $smtpUsername === '' || $smtpPassword === '' || $smtpFromEmail === '') {
    logMailError('Mail configuration is incomplete.');
    respond(false, 'error', 'The mail server is not configured correctly yet.', 500);
}

$submittedAt = date('F j, Y g:i A');
$visitorIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$escapedName = escapeHtml($name);
$escapedEmail = escapeHtml($email);
$escapedSubject = escapeHtml($subject);
$escapedMessage = nl2br(escapeHtml($message));
$escapedSiteName = escapeHtml($siteName);
$escapedPublicEmail = escapeHtml($publicEmail !== '' ? $publicEmail : $smtpFromEmail);

$ownerHtml = <<<HTML
<h2>New Website Inquiry</h2>
<p>You received a new message from the contact form on <strong>{$escapedSiteName}</strong>.</p>
<table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr><td><strong>Name</strong></td><td>{$escapedName}</td></tr>
  <tr><td><strong>Email</strong></td><td><a href="mailto:{$escapedEmail}">{$escapedEmail}</a></td></tr>
  <tr><td><strong>Subject</strong></td><td>{$escapedSubject}</td></tr>
  <tr><td><strong>Submitted</strong></td><td>{$submittedAt}</td></tr>
  <tr><td><strong>IP Address</strong></td><td>{$visitorIp}</td></tr>
</table>
<p><strong>Message</strong></p>
<div style="padding:16px;border-radius:8px;background:#f7f7f7;border:1px solid #e6e6e6;">{$escapedMessage}</div>
HTML;

$ownerAlt = "New Website Inquiry\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Subject: {$subject}\n"
    . "Submitted: {$submittedAt}\n"
    . "IP Address: {$visitorIp}\n\n"
    . "Message:\n{$message}\n";

$replyHtml = <<<HTML
<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#1f2937;line-height:1.7;">
  <h2 style="margin-bottom:12px;">Thank you for reaching out, {$escapedName}.</h2>
  <p>Your message has been received successfully. I appreciate you taking the time to get in touch.</p>
  <p><strong>Your subject</strong><br>{$escapedSubject}</p>
  <p><strong>Your message</strong><br>{$escapedMessage}</p>
  <p>I will review your inquiry and reply as soon as possible.</p>
  <p style="margin-top:24px;">Warm regards,<br><strong>Dini Umairoh</strong><br><a href="mailto:{$escapedPublicEmail}">{$escapedPublicEmail}</a></p>
</div>
HTML;

$replyAlt = "Thank you for reaching out, {$name}.\n\n"
    . "Your message has been received successfully.\n\n"
    . "Your subject:\n{$subject}\n\n"
    . "Your message:\n{$message}\n\n"
    . "I will review your inquiry and reply as soon as possible.\n\n"
    . "Warm regards,\nDini Umairoh\n{$publicEmail}\n";

try {
    sendViaConfiguredSmtp(
        static function (PHPMailer $ownerMailer) use ($notificationEmail, $notificationName, $email, $name, $subject, $ownerHtml, $ownerAlt): void {
            $ownerMailer->addAddress($notificationEmail, $notificationName);
            $ownerMailer->addReplyTo($email, $name);
            $ownerMailer->isHTML(true);
            $ownerMailer->Subject = 'New portfolio inquiry: ' . $subject;
            $ownerMailer->Body = $ownerHtml;
            $ownerMailer->AltBody = $ownerAlt;
        },
        $smtp,
        $smtpUsername,
        $smtpPassword,
        $smtpFromEmail,
        $smtpFromName,
        'Owner mail'
    );
} catch (Exception $exception) {
    respond(false, 'error', 'Sorry, the message could not be sent right now. Please try again shortly.', 500);
}

try {
    sendViaConfiguredSmtp(
        static function (PHPMailer $replyMailer) use ($email, $name, $publicEmail, $notificationName, $replyHtml, $replyAlt): void {
            $replyMailer->addAddress($email, $name);
            if ($publicEmail !== '') {
                $replyMailer->addReplyTo($publicEmail, $notificationName);
            }
            $replyMailer->isHTML(true);
            $replyMailer->Subject = 'Thanks for contacting Dini Umairoh';
            $replyMailer->Body = $replyHtml;
            $replyMailer->AltBody = $replyAlt;
        },
        $smtp,
        $smtpUsername,
        $smtpPassword,
        $smtpFromEmail,
        $smtpFromName,
        'Auto-reply mail'
    );
} catch (Exception $exception) {
    respond(true, 'partial', 'Your message was sent successfully, but the confirmation email could not be delivered.');
}

respond(true, 'success', 'Your message was sent successfully. A confirmation email is on the way.');
