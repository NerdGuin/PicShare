import './index.css';

function Features() {
  return (
    <section className="features">
      <div className="section-header">
        <h2 className="section-title" data-i18n="community_title">
          Why Join Our Community?
        </h2>
        <p className="section-desc" data-i18n="community_subtitle">
          We provide the best platform for photographers and creatives.
        </p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <i className="ri-upload-2-fill"></i>
          </div>
          <h3 className="feature-title" data-i18n="community_uploadtitle">
            Easy Upload
          </h3>
          <p className="feature-desc" data-i18n="community_uploadsubtitle">
            Upload your masterpieces in seconds with our smart drag-and-drop
            interface.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <i className="ri-hd-fill"></i>
          </div>
          <h3 className="feature-title" data-i18n="community_qualitytitle">
            High Quality
          </h3>
          <p className="feature-desc" data-i18n="community_qualitysubtitle">
            Download and share content in stunning HD and 4K resolution without
            compression.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <i className="ri-global-fill"></i>
          </div>
          <h3 className="feature-title" data-i18n="community_sharetitle">
            Community Sharing
          </h3>
          <p className="feature-desc" data-i18n="community_sharesubtitle">
            Connect with millions of photography enthusiasts globally and build
            your audience.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;
