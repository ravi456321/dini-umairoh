export default function AboutSection({ about }) {
  return (
    <section className="ftco-about img ftco-section ftco-no-pb" id="about-section">
      <div className="container">
        <div className="row d-flex">
          <div className="col-md-6 col-lg-5 d-flex">
            <div className="img-about img d-flex align-items-stretch">
              <div className="overlay"></div>
              <div
                className="img d-flex align-self-stretch align-items-center"
                style={{ backgroundImage: `url(${about.image})` }}
              ></div>
            </div>
          </div>
          <div className="col-md-6 col-lg-7 pl-lg-5 pb-5">
            <div className="row justify-content-start pb-3">
              <div className="col-md-12 heading-section ftco-animate">
                <h1 className="big">About</h1>
                <h2 className="mb-4">About Me</h2>
                <p>{about.summary}</p>
                <ul className="about-info mt-4 px-md-0 px-2">
                  {about.details.map((detail) => (
                    <li className="d-flex" key={detail.label}>
                      <span>{detail.label}</span> <span>{detail.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="counter-wrap ftco-animate d-flex mt-md-3">
              <div className="text">
                <p className="mb-4">
                  <span className="number" data-number={about.completedProjects}>
                    0
                  </span>{' '}
                  <span>Projects completed</span>
                </p>
                <p>
                  <a href={about.resumeHref} className="btn btn-primary py-3 px-3" download>
                    Download CV
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

