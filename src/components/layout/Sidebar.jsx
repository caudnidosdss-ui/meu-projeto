import { useState } from 'react';
import './Sidebar.css';

/**
 * Sidebar component with XCOMM logo and navigation menu
 */
const Sidebar = ({ activeItem = 'conferencia', onNavigate }) => {
  const [active, setActive] = useState(activeItem);

  const menuItems = [
    { id: 'conferencia', label: 'Conferência', icon: '📦' },
    { id: 'romaneios', label: 'Romaneios', icon: '📋' },
    { id: 'historico', label: 'Histórico', icon: '📊' },
    { id: 'relatorios', label: 'Relatórios', icon: '📈' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
  ];

  const handleNavClick = (itemId) => {
    setActive(itemId);
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">XCOMM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${active === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <span>👤</span>
          </div>
          <div className="user-info">
            <span className="user-name">Operador</span>
            <span className="user-status">
              <span className="status-dot"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
