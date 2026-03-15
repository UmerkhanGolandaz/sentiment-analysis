import { FiHome, FiMessageSquare, FiAlertTriangle, FiLayers, FiGrid, FiStar } from 'react-icons/fi';
import './Sidebar.css';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FiHome },
  { id: 'predict', label: 'Live Prediction', icon: FiMessageSquare },
  { id: 'bias', label: 'Data Bias Analysis', icon: FiAlertTriangle },
  { id: 'models', label: 'Model Comparison', icon: FiLayers },
  { id: 'sparsity', label: 'Sparsity Analysis', icon: FiGrid },
  { id: 'features', label: 'Top Features', icon: FiStar },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">SA</div>
        <div>
          <h2>Sentiment AI</h2>
          <p className="sidebar-subtitle">Movie Review Analysis</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">MENU</div>
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="project-info">
          <p className="project-label">Submitted to</p>
          <p className="project-name">Prof. Richa Agnihotri</p>
          <p className="project-desc">Machine Learning Project</p>
        </div>
      </div>
    </div>
  );
}
