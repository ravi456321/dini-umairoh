<?php

return [
    'timezone' => 'Asia/Jakarta',
    'site' => [
        'name' => 'Dini Umairoh Portfolio',
        'public_email' => 'diniumai@gmail.com',
        'notification_email' => 'diniumai@gmail.com',
        'notification_name' => 'Dini Umairoh',
    ],
    'smtp' => [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'secure' => 'tls',
        'username' => 'your-gmail@gmail.com',
        'password' => 'your-app-password',
        'from_email' => 'your-gmail@gmail.com',
        'from_name' => 'Dini Umairoh Website',
    ],
    'security' => [
        'rate_limit_window_seconds' => 900,
        'rate_limit_max_attempts' => 3,
        'minimum_submit_seconds' => 3,
    ],
];
