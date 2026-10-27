import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  DollarSign, 
  Users, 
  AlertCircle, 
  Search, 
  XCircle, 
  FileText 
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';

const MyBookingsPage = () => {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | CONFIRMED | CANCELLED

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.getMyBookings();
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      setError('Failed to fetch your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    setCancelling(true);
    try {
      const res = await bookingApi.cancelBooking(selectedBooking.id);
      if (res.success) {
        showToast('Booking cancelled successfully. Seats have been restored.', 'info');
        setCancelModalOpen(false);
        setSelectedBooking(null);
        fetchBookings();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel booking';
      showToast(msg, 'error');
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'CONFIRMED') return b.status === 'CONFIRMED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  const formatDateTime = (dtStr) => {
    try {
      const d = new Date(dtStr);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dtStr;
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
          marginBottom: '28px',
        }}>
          <div>
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">
              Review and manage your confirmed and past carpooling trips
            </p>
          </div>
          <Link to="/rides" className="btn btn-primary btn-sm">
            <Search size={16} /> Find New Ride
          </Link>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '28px',
          paddingBottom: '8px',
        }}>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`btn btn-sm ${activeTab === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('CONFIRMED')}
            className={`btn btn-sm ${activeTab === 'CONFIRMED' ? 'btn-primary' : 'btn-outline'}`}
          >
            Confirmed ({bookings.filter((b) => b.status === 'CONFIRMED').length})
          </button>
          <button
            onClick={() => setActiveTab('CANCELLED')}
            className={`btn btn-sm ${activeTab === 'CANCELLED' ? 'btn-primary' : 'btn-outline'}`}
          >
            Cancelled ({bookings.filter((b) => b.status === 'CANCELLED').length})
          </button>
        </div>

        {/* List Content */}
        {loading ? (
          <LoadingSpinner text="Retrieving your bookings..." />
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px', borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}>
            <AlertCircle size={32} color="#EF4444" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#B91C1C', fontWeight: 600 }}>{error}</p>
            <button onClick={fetchBookings} className="btn btn-sm btn-outline" style={{ marginTop: '16px' }}>
              Retry
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={activeTab === 'ALL' ? 'No Bookings Yet' : `No ${activeTab.toLowerCase()} bookings`}
            message="When you book seats on an offered ride, they will appear here with driver details and trip instructions."
            actionText="Browse Rides"
            actionLink="/rides"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card" style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '16px',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span className={`badge badge-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        Booking #{booking.id} &middot; Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0B192C' }}>
                      {booking.ride?.sourceLocation} ➔ {booking.ride?.destinationLocation}
                    </h2>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
                      ${Number(booking.totalPrice).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      {booking.seatsBooked} {booking.seatsBooked === 1 ? 'seat reserved' : 'seats reserved'}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  border: '1px solid #E2E8F0',
                  marginBottom: '16px',
                }} className="booking-details-grid">
                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>Departure</span>
                    <strong style={{ color: '#0F172A' }}>{formatDateTime(booking.ride?.departureTime)}</strong>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>Driver</span>
                    <strong style={{ color: '#0F172A' }}>{booking.ride?.driver?.fullName}</strong>
                    {booking.ride?.driver?.phone && (
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>
                        {booking.ride.driver.phone}
                      </span>
                    )}
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>Vehicle</span>
                    <strong style={{ color: '#0F172A' }}>{booking.ride?.vehicleModel}</strong>
                    {booking.ride?.vehicleNumber && (
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>
                        Plate: {booking.ride.vehicleNumber}
                      </span>
                    )}
                  </div>
                </div>

                {booking.bookingNotes && (
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} color="#64748B" />
                    <span>Your Note: "{booking.bookingNotes}"</span>
                  </div>
                )}

                {/* Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                  <Link to={`/rides/${booking.ride?.id}`} style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 600 }}>
                    View Trip Details
                  </Link>

                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleOpenCancelModal(booking)}
                      className="btn btn-sm btn-outline"
                      style={{ color: '#EF4444', borderColor: '#FECACA' }}
                    >
                      <XCircle size={14} /> Cancel Booking
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Ride Booking"
        message={`Are you sure you want to cancel your booking for ${selectedBooking?.ride?.sourceLocation} to ${selectedBooking?.ride?.destinationLocation}? The ${selectedBooking?.seatsBooked} reserved seat(s) will be restored to the available pool.`}
        confirmText="Yes, Cancel Booking"
        confirmVariant="danger"
        isLoading={cancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelModalOpen(false)}
      />

      <style>{`
        @media (max-width: 768px) {
          .booking-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookingsPage;
