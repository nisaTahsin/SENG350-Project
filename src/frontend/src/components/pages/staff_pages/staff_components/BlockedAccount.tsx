import React from 'react';
import '../../../Login.css';

const BlockedAccount: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="page-title">Account Blocked</h1>
          <h2>Your account has been blocked</h2>
        </div>
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#333',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          <p style={{ marginBottom: '20px' }}>
            Your account has been blocked. Please contact support for assistance.
          </p>
          <p style={{ 
            marginTop: '30px', 
            fontSize: '1.2rem', 
            fontWeight: '600',
            color: '#0a4a7e'
          }}>
            Contact: (250) 555-5555
          </p>
          <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
            for help
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="login-button"
            style={{ marginTop: '30px', width: '100%' }}
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedAccount;

