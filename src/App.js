import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import BiasAnalysis from './pages/BiasAnalysis';
import ModelComparison from './pages/ModelComparison';
import SparsityAnalysis from './pages/SparsityAnalysis';
import TopFeatures from './pages/TopFeatures';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'predict': return <Predict />;
      case 'bias': return <BiasAnalysis />;
      case 'models': return <ModelComparison />;
      case 'sparsity': return <SparsityAnalysis />;
      case 'features': return <TopFeatures />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
