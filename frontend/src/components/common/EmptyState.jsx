import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({
  icon: Icon = AlertCircle,
  title = 'No items found',
  message = 'There is no data to display right now.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="card" style={{
      textAlign: 'center',
      padding: '48px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'dashed',
    }}>
      <div style={{
        backgroundColor: '#F1F5F9',
        color: '#64748B',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}>
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ color: '#64748B', maxWidth: '420px', fontSize: '0.92rem', marginBottom: actionText ? '24px' : '0' }}>
        {message}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
