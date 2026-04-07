export default function Footer({ contact, footer, onNavigate, quickLinks }) {
  return (
    <footer className="ftco-footer ftco-section">
      <div className="container">
        <div className="row mb-5">
          <div className="col-md">
            <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">About Me</h2>
              <p>{footer.about}</p>
              <ul className="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                {footer.socialLinks.map((socialLink) => (
                  <li className="ftco-animate" key={socialLink.label}>
                    <a href={socialLink.href} target="_blank" rel="noreferrer" aria-label={socialLink.label}>
                      <span className={socialLink.icon}></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md">
            <div className="ftco-footer-widget mb-4 ml-md-4">
              <h2 className="ftco-heading-2">Links</h2>
              <ul className="list-unstyled">
                {quickLinks.map((link) => (
                  <li key={link.sectionId}>
                    <a
                      href={`#${link.sectionId}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onNavigate(link.sectionId);
                      }}
                    >
                      <span className="icon-long-arrow-right mr-2"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md">
            <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">Services</h2>
              <ul className="list-unstyled">
                {footer.services.map((service) => (
                  <li key={service}>
                    <a
                      href="#services-section"
                      onClick={(event) => {
                        event.preventDefault();
                        onNavigate('services-section');
                      }}
                    >
                      <span className="icon-long-arrow-right mr-2"></span>
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md">
            <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">Have a Question?</h2>
              <div className="block-23 mb-3">
                <ul>
                  <li>
                    <span className="icon icon-map-marker"></span>
                    <span className="text">{contact.address}</span>
                  </li>
                  <li>
                    <a href={contact.phoneHref}>
                      <span className="icon icon-phone"></span>
                      <span className="text">{contact.phoneLabel}</span>
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${contact.email}`}>
                      <span className="icon icon-envelope"></span>
                      <span className="text">{contact.email}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <p>Copyright &copy; {new Date().getFullYear()} All rights reserved | Designed by Dini Umairoh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

