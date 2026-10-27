import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Car, 
  Search, 
  PlusCircle, 
  User, 
  LayoutDashboard, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('You have been logged out successfully', 'info');
    navigate('/');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{
      backgroundColor: '#0B192C',
      color: '#FFFFFF',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <Car size={22} />
          </div>
          <div>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}>
              Smart<span style={{ color: '#10B981' }}>Carpool</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link to="/rides" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#E2E8F0',
            fontSize: '0.92rem',
            fontWeight: 500,
            transition: 'color 0.2s',
          }} onMouseEnter={(e) => e.target.style.color = '#FFFFFF'} onMouseLeave={(e) => e.target.style.color = '#E2E8F0'}>
            <Search size={16} />
            Find a Ride
          </Link>

          <Link to="/offer-ride" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#E2E8F0',
            fontSize: '0.92rem',
            fontWeight: 500,
            transition: 'color 0.2s',
          }} onMouseEnter={(e) => e.target.style.color = '#FFFFFF'} onMouseLeave={(e) => e.target.style.color = '#E2E8F0'}>
            <PlusCircle size={16} />
            Offer a Ride
          </Link>

          <a href="#how-it-works" onClick={(e) => {
            if (window.location.pathname !== '/') {
              // navigate to home anchor
            }
          }} style={{
            color: '#94A3B8',
            fontSize: '0.92rem',
            fontWeight: 500,
            transition: 'color 0.2s',
          }} onMouseEnter={(e) => e.target.style.color = '#FFFFFF'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>
            How It Works
          </a>
        </div>

        {/* Desktop Auth / User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '9999px',
                  padding: '6px 14px 6px 8px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}>
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span>{user?.fullName?.split(' ')[0] || 'Account'}</span>
                <ChevronDown size={14} style={{ color: '#94A3B8' }} />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A',
                    padding: '8px 0',
                    zIndex: 200,
                  }}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.fullName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>{user?.email}</div>
                    {isAdmin && (
                      <span className="badge badge-admin" style={{ marginTop: '6px', display: 'inline-block' }}>
                        Administrator
                      </span>
                    )}
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontSize: '0.88rem',
                      color: '#334155',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontSize: '0.88rem',
                      color: '#334155',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Calendar size={16} /> My Bookings
                  </Link>

                  <Link
                    to="/my-rides"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontSize: '0.88rem',
                      color: '#334155',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Car size={16} /> My Offered Rides
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontSize: '0.88rem',
                      color: '#334155',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <User size={16} /> Profile & Settings
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        color: '#7E22CE',
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF5FF'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ShieldCheck size={16} /> Admin Panel
                    </Link>
                  )}

                  <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '4px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        color: '#EF4444',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="btn btn-sm btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0B192C',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }} className="mobile-drawer">
          <Link to="/rides" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} /> Find a Ride
          </Link>
          <Link to="/offer-ride" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} /> Offer a Ride
          </Link>
          
          {isAuthenticated ? (
            <>
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} /> My Bookings
              </Link>
              <Link to="/my-rides" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Car size={18} /> My Offered Rides
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} /> Profile & Settings
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} /> Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-sm btn-danger" style={{ marginTop: '12px' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ color: '#FFFFFF' }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-auth {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
