import React, { useState, useEffect } from 'react';
import { adminApi, healthApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, 
  Users, 
  Car, 
  Calendar, 
  DollarSign, 
  Trash2, 
  XCircle, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmationModal from '../components/common/ConfirmationModal';

const AdminDashboardPage = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('USERS'); // USERS | RIDES | SYSTEM

  // Delete User Modal
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);

  // Cancel Ride Modal
  const [cancelRideModal, setCancelRideModal] = useState(false);
  const [rideToCancel, setRideToCancel] = useState(null);
  const [cancellingRide, setCancellingRide] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, ridesRes, healthRes] = await Promise.allSettled([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getRides(),
        healthApi.checkHealth(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsers(usersRes.value.data || []);
      }
      if (ridesRes.status === 'fulfilled' && ridesRes.value.success) {
        setRides(ridesRes.value.data || []);
      }
      if (healthRes.status === 'fulfilled') {
        setHealth(healthRes.value);
      }
    } catch (err) {
      showToast('Error loading administrative data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingUser(true);
    try {
      const res = await adminApi.deleteUser(userToDelete.id);
      if (res.success) {
        showToast(`User ${userToDelete.fullName} removed from platform`, 'info');
        setDeleteUserModal(false);
        setUserToDelete(null);
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setDeletingUser(false);
    }
  };

  const handleCancelRide = async () => {
    if (!rideToCancel) return;
    setCancellingRide(true);
    try {
      const res = await adminApi.cancelRide(rideToCancel.id);
      if (res.success) {
        showToast(`Ride #${rideToCancel.id} cancelled by administrator`, 'info');
        setCancelRideModal(false);
        setRideToCancel(null);
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel ride', 'error');
    } finally {
      setCancellingRide(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span className="badge badge-admin">
                <ShieldCheck size={12} /> System Administration
              </span>
            </div>
            <h1 className="page-title">Platform Administration Panel</h1>
            <p className="page-subtitle">
              Monitor system metrics, audit registered users, and moderate offered rides
            </p>
          </div>

          <button onClick={fetchAdminData} className="btn btn-outline btn-sm">
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {/* METRICS ROW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }} className="admin-stats-grid">
          
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Total Users</span>
              <Users size={16} color="#2563EB" />
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800 }}>
              {stats?.totalUsers ?? '...'}
            </div>
          </div>

          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Total Rides</span>
              <Car size={16} color="#10B981" />
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800 }}>
              {stats?.totalRides ?? '...'}
            </div>
          </div>

          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Active Rides</span>
              <Car size={16} color="#3B82F6" />
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: '#2563EB' }}>
              {stats?.activeRides ?? '...'}
            </div>
          </div>

          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Total Bookings</span>
              <Calendar size={16} color="#F59E0B" />
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800 }}>
              {stats?.totalBookings ?? '...'}
            </div>
          </div>

          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Platform Revenue</span>
              <DollarSign size={16} color="#10B981" />
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: '#10B981' }}>
              ${stats ? Number(stats.totalRevenue).toFixed(2) : '0.00'}
            </div>
          </div>

        </div>

        {/* TAB CONTROLS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '24px',
          paddingBottom: '8px',
        }}>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`btn btn-sm ${activeTab === 'USERS' ? 'btn-primary' : 'btn-outline'}`}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('RIDES')}
            className={`btn btn-sm ${activeTab === 'RIDES' ? 'btn-primary' : 'btn-outline'}`}
          >
            All Rides ({rides.length})
          </button>
          <button
            onClick={() => setActiveTab('SYSTEM')}
            className={`btn btn-sm ${activeTab === 'SYSTEM' ? 'btn-primary' : 'btn-outline'}`}
          >
            System Status & Health
          </button>
        </div>

        {/* TAB CONTENT */}
        {loading ? (
          <LoadingSpinner text="Retrieving administrative data..." />
        ) : activeTab === 'USERS' ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>
                        <strong>{u.fullName}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>
                        <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-scheduled'}`}>
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        {u.role !== 'ROLE_ADMIN' && (
                          <button
                            onClick={() => {
                              setUserToDelete(u);
                              setDeleteUserModal(true);
                            }}
                            className="btn btn-sm btn-outline"
                            style={{ color: '#EF4444', borderColor: '#FECACA', padding: '4px 8px' }}
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'RIDES' ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Trip ID</th>
                    <th>Route</th>
                    <th>Driver</th>
                    <th>Departure</th>
                    <th>Seats</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>
                        <strong>{r.sourceLocation} ➔ {r.destinationLocation}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{r.vehicleModel}</div>
                      </td>
                      <td>{r.driver?.fullName}</td>
                      <td>{new Date(r.departureTime).toLocaleString()}</td>
                      <td>{r.availableSeats} / {r.totalSeats}</td>
                      <td>${Number(r.pricePerSeat).toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${r.status.toLowerCase()}`}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {r.status === 'SCHEDULED' && (
                          <button
                            onClick={() => {
                              setRideToCancel(r);
                              setCancelRideModal(true);
                            }}
                            className="btn btn-sm btn-outline"
                            style={{ color: '#EF4444', borderColor: '#FECACA', fontSize: '0.78rem', padding: '4px 8px' }}
                            title="Admin Cancel Ride"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B192C', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#10B981" /> Backend Health Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Health Endpoint:</span>
                  <span style={{ color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} /> {health?.status || 'UP'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Backend Engine:</span>
                  <strong style={{ color: '#0F172A' }}>Spring Boot 3.3.4 (Java 21)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Database Engine:</span>
                  <strong style={{ color: '#0F172A' }}>MySQL 8.0 (with H2 Dev Mode)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Authentication:</span>
                  <strong style={{ color: '#0F172A' }}>Stateless JWT (HMAC-SHA256)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Last Checked:</span>
                  <span style={{ color: '#64748B' }}>{health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Just now'}</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B192C', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#2563EB" /> Security & Deployment Notice
              </h3>
              <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '14px' }}>
                All sensitive parameters (MySQL database credentials, JWT secret keys, and allowed CORS origins) are decoupled from the application source and managed via environment variables.
              </p>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: '#64748B', border: '1px solid #E2E8F0' }}>
                <strong>CORS Policy:</strong> Access is restricted strictly to registered frontend domains (Vercel production URL and localhost).
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Delete User Modal */}
      <ConfirmationModal
        isOpen={deleteUserModal}
        title="Delete User Account"
        message={`Are you sure you want to delete user ${userToDelete?.fullName} (${userToDelete?.email})? This action is irreversible and cascades to their rides and bookings.`}
        confirmText="Delete User"
        confirmVariant="danger"
        isLoading={deletingUser}
        onConfirm={handleDeleteUser}
        onClose={() => setDeleteUserModal(false)}
      />

      {/* Cancel Ride Modal */}
      <ConfirmationModal
        isOpen={cancelRideModal}
        title="Force Cancel Ride"
        message={`Are you sure you want to cancel Ride #${rideToCancel?.id} (${rideToCancel?.sourceLocation} to ${rideToCancel?.destinationLocation})? All passengers will have their bookings cancelled.`}
        confirmText="Cancel Ride"
        confirmVariant="danger"
        isLoading={cancellingRide}
        onConfirm={handleCancelRide}
        onClose={() => setCancelRideModal(false)}
      />

      <style>{`
        @media (max-width: 1024px) {
          .admin-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .admin-stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
