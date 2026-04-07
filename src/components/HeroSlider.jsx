import { useEffect, useState } from 'react';

export default function HeroSlider({ onNavigate, slides }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  return (
    <section id="home-section" className="hero">
      <div className="owl-carousel home-slider home-slider-react">
        {slides.map((slide, index) => (
          <div
            className={`slider-item ${index === activeIndex ? 'is-active' : ''}`}
            key={slide.id}
            aria-hidden={index !== activeIndex}
          >
            <div className="overlay"></div>
            <div className="container">
              <div className="row d-md-flex no-gutters slider-text align-items-end justify-content-end">
                <div
                  className="one-third js-fullheight order-md-last img"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="overlay"></div>
                </div>
                <div className="one-forth d-flex align-items-center ftco-animate">
                  <div className="text">
                    <span className="subheading">{slide.greeting}</span>
                    <h1 className="mb-4 mt-3">
                      {slide.titlePrefix}
                      <span>{slide.titleAccent}</span>
                      {slide.titleSuffix}
                    </h1>
                    {slide.subtitle ? <h2 className="mb-4">{slide.subtitle}</h2> : null}
                    <p>
                      <a
                        href="#contact-section"
                        className="btn btn-primary py-3 px-4"
                        onClick={(event) => {
                          event.preventDefault();
                          onNavigate('contact-section');
                        }}
                      >
                        Hire me
                      </a>
                      <a
                        href="#projects-section"
                        className="btn btn-white btn-outline-white py-3 px-4"
                        onClick={(event) => {
                          event.preventDefault();
                          onNavigate('projects-section');
                        }}
                      >
                        My works
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="owl-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`owl-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

