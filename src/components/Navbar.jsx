export default function Navbar({
  activeSection,
  className,
  isMenuOpen,
  links,
  onNavigate,
  onToggleMenu,
}) {
  return (
    <nav className={className} id="ftco-navbar">
      <div className="container">
        <a
          className="navbar-brand text-center"
          href="#home-section"
          onClick={(event) => {
            event.preventDefault();
            onNavigate('home-section');
          }}
        >
          <img className="logo" src="/images/logo.png" alt="Dini Umairoh logo" />
          <span>Dini Umairoh</span>
        </a>

        <button
          className={`navbar-toggler js-fh5co-nav-toggle fh5co-nav-toggle ${isMenuOpen ? 'active' : ''}`}
          type="button"
          aria-controls="ftco-nav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={onToggleMenu}
        >
          <span className="oi oi-menu"></span> Menu
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="ftco-nav">
          <ul className="navbar-nav nav ml-auto">
            {links.map((link) => {
              const isActive = activeSection === link.sectionId;

              return (
                <li className={`nav-item ${isActive ? 'active' : ''}`} key={link.sectionId}>
                  <a
                    href={`#${link.sectionId}`}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(link.sectionId);
                    }}
                  >
                    <span>{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

