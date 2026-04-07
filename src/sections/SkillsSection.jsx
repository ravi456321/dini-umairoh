import SectionHeading from '../components/SectionHeading';

export default function SkillsSection({ skills }) {
  return (
    <section className="ftco-section" id="skills-section">
      <div className="container">
        <div className="row justify-content-center pb-5">
          <SectionHeading
            bigTitle="Skills"
            title="My Skills"
            description="Design expertise combined with strategic thinking to deliver impactful visual solutions."
          />
        </div>
        <div className="row">
          {skills.map((skill) => (
            <div className="col-md-6 animate-box" key={skill.title}>
              <div className="progress-wrap ftco-animate">
                <h3>{skill.title}</h3>
                <div className="progress">
                  <div
                    className={`progress-bar ${skill.colorClass}`}
                    role="progressbar"
                    style={{ width: `${skill.percentage}%` }}
                    aria-valuenow={skill.percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span>{skill.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

