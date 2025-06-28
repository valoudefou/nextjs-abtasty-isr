import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  flagBirthField: boolean;  // <-- Added this prop
}

const Layout: React.FC<LayoutProps> = ({ children, flagBirthField }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1>Dynamic Form Application</h1>
          <div style={{ 
            padding: '0.5rem', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>
          </div>
          <div style={{
            padding: '0.5rem',
            backgroundColor: flagBirthField ? '#cce5ff' : '#f8d7da',
            color: flagBirthField ? '#004085' : '#721c24',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            flagBirthField: <strong>{flagBirthField ? 'true' : 'false'}</strong>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Layout;
