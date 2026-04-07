export default function HireSection({ onNavigate }) {
  return (
    <section
      className="ftco-section ftco-hireme img margin-top"
      style={{ backgroundImage: 'url(/images/4.jpg)' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 ftco-animate text-center">
            <h2>
              I'm <span>Available</span> for Freelance Projects
            </h2>
            <p>Let's work together to create impactful designs that elevate your brand.</p>
            <p className="mb-0">
              <a
                href="#contact-section"
                className="btn btn-primary py-3 px-5"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate('contact-section');
                }}
              >
                Hire Me
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

