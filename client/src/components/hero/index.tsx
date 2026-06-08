import './index.css';
import { uploadImage } from '../../assets/auth/gallery.tsx';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-accent"></div>
      <div className="hero-content">
        <h1 className="hero-title" data-i18n="hero_title">
          Discover Beautiful Images
        </h1>
        <p className="hero-subtitle" data-i18n="hero_subtitle">
          Upload, share, and download high-quality images
          <br />
          from creators around the world.
        </p>
        <div className="cta-group">
          <button
            className="btn btn-primary"
            onClick={() => {
              uploadImage();
            }}
          >
            <i className="ri-upload-cloud-2-fill"></i>
            <span data-i18n="hero_upload">Upload Your Image</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              window.location.href = '/gallery';
            }}
          >
            <i className="ri-gallery-view-2"></i>
            <span data-i18n="hero_browser">Browse Images</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
