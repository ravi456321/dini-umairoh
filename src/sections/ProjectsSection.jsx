import SectionHeading from '../components/SectionHeading';

function ProjectCard({ project }) {
  return (
    <div
      className="project img ftco-animate d-flex justify-content-center align-items-center"
      style={{ backgroundImage: `url(${project.image})` }}
    >
      <div className="overlay"></div>
      <div className="text text-center p-4">
        <h3>
          <a href="#projects-section">{project.title}</a>
        </h3>
        <span>{project.category}</span>
      </div>
    </div>
  );
}

export default function ProjectsSection({ projects }) {
  const [firstProject, secondProject, thirdProject, fourthProject, fifthProject, sixthProject] = projects;

  return (
    <section className="ftco-section ftco-project" id="projects-section">
      <div className="container">
        <div className="row justify-content-center pb-5">
          <SectionHeading
            bigTitle="Portfolio"
            title="Selected Works"
            description="A showcase of branding, marketing, and digital design projects."
          />
        </div>
        <div className="row">
          <div className="col-md-4">
            <ProjectCard project={firstProject} />
          </div>
          <div className="col-md-8">
            <ProjectCard project={secondProject} />
          </div>
          <div className="col-md-8">
            <ProjectCard project={thirdProject} />
            <ProjectCard project={fourthProject} />
          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="col-md-12">
                <ProjectCard project={fifthProject} />
              </div>
              <div className="col-md-12">
                <ProjectCard project={sixthProject} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
