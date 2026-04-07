import { useEffect, useMemo, useState } from 'react';
import HeroSlider from './components/HeroSlider';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import {
  about,
  blogPosts,
  contact,
  footer,
  heroSlides,
  navLinks,
  projects,
  resume,
  services,
  skills,
  stats,
} from './data/portfolioData';
import { usePortfolioEffects } from './hooks/usePortfolioEffects';
import AboutSection from './sections/AboutSection';
import BlogSection from './sections/BlogSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import HireSection from './sections/HireSection';
import ProjectsSection from './sections/ProjectsSection';
import ResumeSection from './sections/ResumeSection';
import ServicesSection from './sections/ServicesSection';
import SkillsSection from './sections/SkillsSection';
import StatsSection from './sections/StatsSection';

const baseNavbarClassName =
  'navbar navbar-expand-lg navbar-dark ftco_navbar ftco-navbar-light site-navbar-target';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionIds = useMemo(() => navLinks.map((link) => link.sectionId), []);
  const { activeSection, navbarState, scrollToSection } = usePortfolioEffects(sectionIds);

  useEffect(() => {
    document.title = 'Dini Umairoh - Graphic Designer & Branding Specialist';
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => setIsLoading(false), 250);
    return () => window.clearTimeout(timerId);
  }, []);

  const handleNavigate = (sectionId) => {
    setIsMenuOpen(false);
    scrollToSection(sectionId);
  };

  const navbarClassName = [
    baseNavbarClassName,
    navbarState.scrolled ? 'scrolled' : '',
    navbarState.awake ? 'awake' : '',
    navbarState.sleep ? 'sleep' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <Navbar
        activeSection={activeSection}
        className={navbarClassName}
        isMenuOpen={isMenuOpen}
        links={navLinks}
        onNavigate={handleNavigate}
        onToggleMenu={() => setIsMenuOpen((currentState) => !currentState)}
      />
      <HeroSlider slides={heroSlides} onNavigate={handleNavigate} />
      <AboutSection about={about} />
      <ResumeSection resume={resume} />
      <ServicesSection services={services} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <BlogSection blogPosts={blogPosts} />
      <StatsSection stats={stats} />
      <HireSection onNavigate={handleNavigate} />
      <ContactSection contact={contact} />
      <Footer contact={contact} footer={footer} onNavigate={handleNavigate} quickLinks={navLinks.slice(0, 5)} />
      <Loader isVisible={isLoading} />
    </>
  );
}

