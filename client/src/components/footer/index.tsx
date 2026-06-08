import React from "react";
import "./index.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>
            <i className="ri-camera-lens-fill"></i>
            PicShare
          </h3>
          <p data-i18n="footer_text">
            The best place to discover and share beautiful visuals. Join our
            community of creators today.
          </p>
        </div>

        <div className="footer-nav">
          <div className="nav-col">
            <ul>
              <li>
                <a href="#" data-i18n="footer_about">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" data-i18n="footer_jobs">
                  Jobs
                </a>
              </li>
              <li>
                <a href="#" data-i18n="footer_help">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          <div className="nav-col">
            <ul>
              <li>
                <a href="#" data-i18n="footer_privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" data-i18n="footer_terms">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" data-i18n="footer_cookie">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          &copy; 2026 PicShare Inc.{" "}
          <span data-i18n="footer_copyright">All rights reserved.</span>
        </div>
        <div className="social-links">
          <a href="#" className="social-link">
            <i className="ri-twitter-x-fill"></i>
          </a>
          <a href="#" className="social-link">
            <i className="ri-instagram-fill"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
