import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Heart, ExternalLink, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#06101E',
      color: '#94A3B8',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '60px 0 30px',
      fontSize: '0.9rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
          gap: '40px',
          marginBottom: '48px',
        }} className="footer-grid">
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Car size={20} />
              </div>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontSize: '1.2rem',
                color: '#FFFFFF',
              }}>
                Smart<span style={{ color: '#10B981' }}>Carpool</span>
              </span>
            </div>
            <p style={{ lineHeight: 1.6, color: '#64748B', maxWidth: '320px' }}>
              Connecting students and everyday commuters to share rides, split travel costs, reduce carbon emissions, and travel safely.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '0.82rem', fontWeight: 600 }}>
              <Shield size={16} /> Verified Drivers & Safe Community
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/" style={{ color: '#94A3B8' }}>Home</Link>
              </li>
              <li>
                <Link to="/rides" style={{ color: '#94A3B8' }}>Search Rides</Link>
              </li>
              <li>
                <Link to="/offer-ride" style={{ color: '#94A3B8' }}>Publish a Ride</Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: '#94A3B8' }}>User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Popular Corridors */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              Popular Corridors
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>New York ➔ Boston</li>
              <li>San Francisco ➔ San Jose</li>
              <li>Austin ➔ Houston</li>
              <li>Seattle ➔ Portland</li>
              <li>Chicago ➔ Milwaukee</li>
            </ul>
          </div>

          {/* Project & Tech Architecture */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              Project Architecture
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div><strong style={{ color: '#E2E8F0' }}>Backend:</strong> Java 21, Spring Boot 3.3, Spring Security, JWT, JPA</div>
              <div><strong style={{ color: '#E2E8F0' }}>Frontend:</strong> React, Vite, React Router DOM, Axios, Lucide</div>
              <div><strong style={{ color: '#E2E8F0' }}>Database:</strong> MySQL with Flyway Migrations</div>
              <div><strong style={{ color: '#E2E8F0' }}>Deployment:</strong> Vercel (UI) & Render (API / Hosted MySQL)</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#64748B',
        }}>
          <div>
            &copy; {new Date().getFullYear()} Smart Carpool and Ride Sharing System. College Technical Training (TT) Project.
          </div>
          <div>
            Built with modern full-stack standards &middot; Academic Demonstration Project
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
