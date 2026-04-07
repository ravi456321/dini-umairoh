import SectionHeading from '../components/SectionHeading';

export default function BlogSection({ blogPosts }) {
  return (
    <section className="ftco-section" id="blog-section">
      <div className="container">
        <div className="row justify-content-center mb-5 pb-5">
          <SectionHeading
            bigTitle="Blog"
            title="Design Insights"
            description="Articles and tips on branding, marketing, and creative design trends."
            className="col-md-7 heading-section text-center ftco-animate"
          />
        </div>
        <div className="row d-flex">
          {blogPosts.map((post, index) => (
            <div className="col-md-4 d-flex ftco-animate" key={`${post.title}-${index}`}>
              <div className="blog-entry">
                <a href="#blog-section" className="block-20" style={{ backgroundImage: `url(${post.image})` }}></a>
                <div className="text mt-3 float-right d-block">
                  <div className="meta mb-3">
                    <p className="mb-0">
                      <span className="mr-2">{post.date}</span>{' '}
                      <a href="#blog-section" className="mr-2">
                        {post.author}
                      </a>
                    </p>
                  </div>
                  <h3 className="heading">
                    <a href="#blog-section">{post.title}</a>
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

