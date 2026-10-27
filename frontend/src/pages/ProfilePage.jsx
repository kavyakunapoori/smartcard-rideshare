import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateProfileUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    createdAt: '',
  });

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await userApi.getProfile();
        if (res.success && res.data) {
          setProfileData({
            fullName: res.data.fullName,
            email: res.data.email,
            phone: res.data.phone || '',
            role: res.data.role,
            createdAt: res.data.createdAt,
          });
        }
      } catch (err) {
        showToast('Failed to load profile details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [showToast]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!profileData.fullName.trim()) {
      setProfileError('Full name cannot be blank');
      return;
    }

    setUpdatingProfile(true);
    try {
      const res = await userApi.updateProfile({
        fullName: profileData.fullName.trim(),
        phone: profileData.phone.trim() || null,
      });

      if (res.success) {
        setProfileSuccess('Profile updated successfully!');
        updateProfileUser(res.data);
        showToast('Profile updated', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setProfileError(msg);
      showToast(msg, 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (res.success) {
        setPasswordSuccess('Password changed successfully!');
        showToast('Password changed successfully', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      setPasswordError(msg);
      showToast(msg, 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <LoadingSpinner text="Loading profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '32px' }}>
          <h1 className="page-title">Profile & Account Settings</h1>
          <p className="page-subtitle">
            Manage your personal contact details, security credentials, and platform preferences
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.8fr',
          gap: '32px',
        }} className="profile-grid">
          
          {/* LEFT: Profile Avatar Card */}
          <div>
            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontFamily: 'Outfit',
                fontSize: '2.4rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
              }}>
                {profileData.fullName?.charAt(0) || 'U'}
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                {profileData.fullName}
              </h2>
              <div style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '16px' }}>
                {profileData.email}
              </div>

              <div style={{ display: 'inline-block', marginBottom: '20px' }}>
                {isAdmin ? (
                  <span className="badge badge-admin">
                    <ShieldCheck size={12} /> System Administrator
                  </span>
                ) : (
                  <span className="badge badge-scheduled">
                    Community Member
                  </span>
                )}
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', fontSize: '0.82rem', color: '#64748B', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Member Since:</span>
                  <strong style={{ color: '#0F172A' }}>
                    {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Authentication:</span>
                  <strong style={{ color: '#10B981' }}>Active JWT Session</strong>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Edit Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Edit Personal Info */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0B192C', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="#2563EB" /> Personal Details
              </h3>

              {profileSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <CheckCircle size={16} /> <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <AlertCircle size={16} /> <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="prof-name">Full Name</label>
                  <input
                    id="prof-name"
                    type="text"
                    className="form-input"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prof-email">Email Address (Read-only)</label>
                  <input
                    id="prof-email"
                    type="email"
                    className="form-input"
                    value={profileData.email}
                    disabled
                    style={{ backgroundColor: '#F8FAFC', color: '#64748B' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                    Email is your primary login identifier and cannot be changed.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prof-phone">Phone Number</label>
                  <input
                    id="prof-phone"
                    type="tel"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={updatingProfile}
                >
                  {updatingProfile ? 'Saving...' : 'Update Details'}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0B192C', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#2563EB" /> Security & Password
              </h3>

              {passwordSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <CheckCircle size={16} /> <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <AlertCircle size={16} /> <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="cur-pass">Current Password</label>
                  <input
                    id="cur-pass"
                    type="password"
                    className="form-input"
                    placeholder="Enter existing password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-pass">New Password</label>
                    <input
                      id="new-pass"
                      type="password"
                      className="form-input"
                      placeholder="Min 6 characters"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="conf-pass">Confirm New Password</label>
                    <input
                      id="conf-pass"
                      type="password"
                      className="form-input"
                      placeholder="Repeat new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={changingPassword}
                >
                  {changingPassword ? 'Updating Password...' : 'Change Password'}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 800px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
