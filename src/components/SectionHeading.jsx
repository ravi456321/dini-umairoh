export default function SectionHeading({
  bigTitle,
  className = 'col-md-12 heading-section text-center ftco-animate',
  description,
  title,
}) {
  return (
    <div className={className}>
      <h1 className="big big-2">{bigTitle}</h1>
      <h2 className="mb-4">{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
