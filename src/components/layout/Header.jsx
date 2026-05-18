import { useState } from 'react';
import './Header.css';

/**
 * Header component with title and action buttons
 */
const Header = ({ onSettingsClick, onThemeClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-icon">
          <span>📦</span>
        </div>
        <div className="header-text">
          <span className="header-subtitle">CONFERÊNCIA CORREIOS</span>
          <h1 className="header-title">XCOMM</h1>
        </div>
      </div>

      <div className="header-right">
        <button 
          className="header-btn" 
          title="Configurações"
          onClick={onSettingsClick}
        >
          <span>⚙️</span>
        </button>
        <button 
          className="header-btn" 
          title="Tema"
          onClick={onThemeClick}
        >
          <span>🌙</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
