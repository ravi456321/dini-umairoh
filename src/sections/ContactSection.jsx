import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';

const initialFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactSection({ contact }) {
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const body = [`Name: ${formState.name}`, `Email: ${formState.email}`, '', formState.message].join('\n');

    const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
      formState.subject || 'New portfolio inquiry',
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  };

  return (
    <section className="ftco-section contact-section ftco-no-pb" id="contact-section">
      <div className="container">
        <div className="row justify-content-center mb-5 pb-3">
          <SectionHeading
            bigTitle="Contact"
            title="Get In Touch"
            description="Have a project or collaboration in mind? Let's connect."
            className="col-md-7 heading-section text-center ftco-animate"
          />
        </div>

        <div className="row d-flex contact-info mb-5">
          <div className="col-md-6 col-lg-3 d-flex ftco-animate">
            <div className="align-self-stretch box p-4 text-center">
              <div className="icon d-flex align-items-center justify-content-center">
                <span className="icon-map-signs"></span>
              </div>
              <h3 className="mb-4">Address</h3>
              <p>{contact.address}</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 d-flex ftco-animate">
            <div className="align-self-stretch box p-4 text-center">
              <div className="icon d-flex align-items-center justify-content-center">
                <span className="icon-phone2"></span>
              </div>
              <h3 className="mb-4">Phone</h3>
              <p>
                <a href={contact.phoneHref}>{contact.phoneLabel}</a>
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 d-flex ftco-animate">
            <div className="align-self-stretch box p-4 text-center">
              <div className="icon d-flex align-items-center justify-content-center">
                <span className="icon-paper-plane"></span>
              </div>
              <h3 className="mb-4">Email</h3>
              <p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 d-flex ftco-animate">
            <div className="align-self-stretch box p-4 text-center">
              <div className="icon d-flex align-items-center justify-content-center">
                <span className="icon-globe"></span>
              </div>
              <h3 className="mb-4">LinkedIn</h3>
              <p>
                <a href={contact.linkedinHref} target="_blank" rel="noreferrer">
                  {contact.linkedinLabel}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="row no-gutters block-9">
          <div className="col-md-6 order-md-last d-flex">
            <form className="bg-light p-4 p-md-5 contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Your Name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Your Email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  placeholder="Subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  cols="30"
                  rows="7"
                  className="form-control"
                  placeholder="Message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <input type="submit" value="Send Message" className="btn btn-primary py-3 px-5" />
              </div>
            </form>
          </div>

          <div className="col-md-6 d-flex contact-image-panel">
            <div className="img" style={{ backgroundImage: `url(${contact.image})` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

