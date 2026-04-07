import SectionHeading from '../components/SectionHeading';

function ResumeColumn({ items }) {
  return (
    <>
      {items.map((item) => (
        <div className="resume-wrap ftco-animate" key={`${item.date}-${item.title}`}>
          <span className="date">{item.date}</span>
          <h2>{item.title}</h2>
          <span className="position">{item.organization}</span>
          <p className="mt-4">{item.description}</p>
        </div>
      ))}
    </>
  );
}

export default function ResumeSection({ resume }) {
  return (
    <section className="ftco-section ftco-no-pb" id="resume-section">
      <div className="container">
        <div className="row justify-content-center pb-5">
          <SectionHeading bigTitle="Resume" title="My Resume" description={resume.intro} />
        </div>
        <div className="row">
          <div className="col-md-6">
            <ResumeColumn items={resume.education} />
          </div>
          <div className="col-md-6">
            <ResumeColumn items={resume.experience} />
          </div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-md-6 text-center ftco-animate">
            <p>
              <a href={resume.resumeHref} className="btn btn-primary py-4 px-5" download>
                Download CV
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

