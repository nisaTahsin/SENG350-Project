import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GenericPage.css';

interface GenericPageProps {
  title: string;
  description: string;
  userType: 'staff' | 'registrar' | 'admin';
}

const GenericPage: React.FC<GenericPageProps> = ({ title, description, userType }) => {
  const navigate = useNavigate();

  const getDashboardPath = () => {
    switch (userType) {
      case 'staff':
        return '/staff-dashboard';
      case 'registrar':
        return '/registrar-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  return (
    <div className="generic-page">
      <header className="page-header">
        <button 
          className="back-button" 
          onClick={() => navigate(getDashboardPath())}
        >
          ← Back to Dashboard
        </button>
        <h1>{title}</h1>
      </header>
      
      <main className="page-content">
        <div className="page-card">
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="placeholder-content">
            <p>This page is under development.</p>
            <p>Content will be added here in future updates.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenericPage;
