import React from 'react';
import { toggleLanguage } from '../../assets/translator/Translator.tsx';
import './index.css';
import { auth } from '../../assets/auth/auth.tsx';
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';

const Header: React.FC = () => {
  const { isSignedIn } = useUser();
  return (
    <nav className="header">
      <div
        className="logo-container"
        onClick={() => {
          window.location.href = '/';
        }}
      >
        <div className="logo-icon">
          <i className="ri-camera-lens-fill"></i>
        </div>
        <div className="logo-text">PicShare</div>
      </div>

      <div className="search-bar">
        <i className="ri-search-line search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search for inspiration, categories, or artists..."
          data-i18n="search_placeholder"
        />
      </div>

      <div className="header-actions">
        <div
          className="icon-btn"
          title="Languages"
          onClick={() => toggleLanguage()}
        >
          <i className="ri-global-line"></i>
        </div>

        <div className="icon-btn" title="Notifications">
          <i className="ri-notification-3-line"></i>
        </div>

        {!isSignedIn && (
          <SignInButton mode="modal">
            <button className="btn btn-primary">Entrar</button>
          </SignInButton>
        )}

        {/* <div className="user-avatar" onClick={() => auth()}></div>
        <div
          className="icon-btn"
          style={{ width: '24px', height: '24px', marginLeft: '-8px' }}
        >
          <i className="ri-arrow-down-s-fill"></i>
        </div> */}
      </div>
    </nav>
  );
};

export default Header;
