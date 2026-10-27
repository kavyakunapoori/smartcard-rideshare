import React from 'react';

const LoadingSpinner = ({ text = 'Loading details...', size = 32 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: '14px' }}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: '3px solid #E2E8F0',
          borderTopColor: '#2563EB',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite',
        }}
      />
      {text && <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>{text}</span>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
