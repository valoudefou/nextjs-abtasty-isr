import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  flagBirthField: boolean;
  pageTemplate: string;
}

const Layout: React.FC<LayoutProps> = ({ children, flagBirthField, pageTemplate }) => {
  const isTemplate1 = pageTemplate === 'template1';

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: isTemplate1 ? 'Arial, sans-serif' : 'Georgia, serif',
      backgroundColor: isTemplate1 ? '#e0f7fa' : '#ede7f6',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: isTemplate1 ? '2px solid #00acc1' : '2px solid #7e57c2'
      }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ color: isTemplate1 ? '#00796b' : '#5e35b1' }}>
            {isTemplate1 ? 'Dynamic Form - Template 1' : 'Dynamic Form - Template 2'}
          </h1>
          <div style={{
            padding: '0.5rem',
            backgroundColor: flagBirthField ? '#cce5ff' : '#f8d7da',
            color: flagBirthField ? '#004085' : '#721c24',
            borderRadius: '4px',
            fontSize: '0.9rem',
            marginBottom: '1rem'
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
