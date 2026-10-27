import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
        
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#EFF6FF',
          color: '#2563EB',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <Compass size={36} />
        </div>

        <div style={{ fontFamily: 'Outfit', fontSize: '4.5rem', fontWeight: 800, color: '#0B192C', lineHeight: 1 }}>
          404
        </div>

        <h1 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginTop: '12px', marginBottom: '10px' }}>
          Destination Not Found
        </h1>

        <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
          The road you are looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-sm">
            <Home size={16} /> Return to Home
          </Link>
          <Link to="/rides" className="btn btn-outline btn-sm">
            <Search size={16} /> Search Available Rides
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
