export default function StatsSection({ stats }) {
  return (
    <section className="ftco-section ftco-no-pt ftco-no-pb ftco-counter img" id="section-counter">
      <div className="container">
        <div className="row d-md-flex align-items-center">
          {stats.map((stat) => (
            <div className="col-md d-flex justify-content-center counter-wrap ftco-animate" key={stat.label}>
              <div className="block-18">
                <div className="text">
                  <strong className="number" data-number={stat.value}>
                    0
                  </strong>
                  <span>{stat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

