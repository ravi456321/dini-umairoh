import SectionHeading from '../components/SectionHeading';

export default function ServicesSection({ services }) {
  return (
    <section className="ftco-section" id="services-section">
      <div className="container">
        <div className="row justify-content-center py-5 mt-5">
          <SectionHeading
            bigTitle="Services"
            title="What I Offer"
            description="Creative design solutions that help brands stand out and connect with their audience."
          />
        </div>
        <div className="row">
          {services.map((service) => (
            <div className="col-md-4 text-center d-flex ftco-animate" key={service.title}>
              <div className="services-1">
                <span className="icon">
                  <i className={service.icon}></i>
                </span>
                <div className="desc">
                  <h3 className="mb-5">{service.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

