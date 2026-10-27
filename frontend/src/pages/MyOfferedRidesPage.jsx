import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rideApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  PlusCircle, 
  Edit3, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Mail, 
  AlertCircle 
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';

const MyOfferedRidesPage = () => {
  const { showToast } = useToast();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Expand passengers per ride
  const [expandedRideId, setExpandedRideId] = useState(null);
  const [rideBookings, setRideBookings] = useState({});
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Cancel Ride Modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchMyRides = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await rideApi.getMyRides();
      if (res.success) {
        setRides(res.data || []);
      }
    } catch (err) {
      setError('Failed to fetch your offered rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  const togglePassengers = async (rideId) => {
    if (expandedRideId === rideId) {
      setExpandedRideId(null);
      return;
    }

    setExpandedRideId(rideId);
    if (!rideBookings[rideId]) {
      setLoadingBookings(true);
      try {
        const res = await rideApi.getRideBookings(rideId);
        if (res.success) {
          setRideBookings((prev) => ({
            ...prev,
            [rideId]: res.data || [],
          }));
        }
      } catch (err) {
        showToast('Could not load passengers for this ride', 'error');
      } finally {
        setLoadingBookings(false);
      }
    }
  };

  const handleOpenCancelModal = (ride) => {
    setSelectedRide(ride);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRide) return;
    setCancelling(true);
    try {
      const res = await rideApi.cancelRide(selectedRide.id);
      if (res.success) {
        showToast('Ride has been cancelled and associated passenger bookings updated.', 'info');
        setCancelModalOpen(false);
        setSelectedRide(null);
        fetchMyRides();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel ride';
      showToast(msg, 'error');
    } finally {
      setCancelling(false);
    }
  };

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
            <h1 className="page-title">My Offered Rides</h1>
            <p className="page-subtitle">
              Manage trips you have published, view passenger rosters, or update schedules
            </p>
          </div>
          <Link to="/offer-ride" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Offer Another Ride
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Retrieving your offered rides..." />
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px', borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}>
            <AlertCircle size={32} color="#EF4444" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#B91C1C', fontWeight: 600 }}>{error}</p>
            <button onClick={fetchMyRides} className="btn btn-sm btn-outline" style={{ marginTop: '16px' }}>
              Retry
            </button>
          </div>
        ) : rides.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No Rides Offered Yet"
            message="Share your route to your campus or workplace. You set the departure time, seats, and price."
            actionText="Publish Your First Ride"
            actionLink="/offer-ride"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {rides.map((ride) => (
              <div key={ride.id} className="card" style={{ padding: '24px' }}>
                
                {/* Top Bar */}
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
                      <span className={`badge badge-${ride.status.toLowerCase()}`}>
                        {ride.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        Ride #{ride.id} &middot; Created on {new Date(ride.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0B192C' }}>
                      {ride.sourceLocation} ➔ {ride.destinationLocation}
                    </h2>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
                      ${Number(ride.pricePerSeat).toFixed(2)}
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#64748B' }}> / seat</span>
                    </div>
                    <span className="badge badge-seats" style={{ marginTop: '4px' }}>
                      {ride.availableSeats} of {ride.totalSeats} seats available
                    </span>
                  </div>
                </div>

                {/* Ride Stats Box */}
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
                }} className="ride-meta-grid">
                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>Departure Schedule</span>
                    <strong style={{ color: '#0F172A' }}>{formatDateTime(ride.departureTime)}</strong>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>Vehicle Info</span>
                    <strong style={{ color: '#0F172A' }}>{ride.vehicleModel}</strong>
                    {ride.vehicleNumber && (
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>Plate: {ride.vehicleNumber}</span>
                    )}
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>Occupancy Status</span>
                    <strong style={{ color: '#0F172A' }}>
                      {ride.totalSeats - ride.availableSeats} Booked / {ride.totalSeats} Total
                    </strong>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                  
                  {/* Toggle Passengers Button */}
                  <button
                    onClick={() => togglePassengers(ride.id)}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <Users size={14} />
                    {expandedRideId === ride.id ? 'Hide Passengers' : 'View Passengers'}
                    {expandedRideId === ride.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {/* Edit & Cancel Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link to={`/rides/${ride.id}`} className="btn btn-sm btn-outline" style={{ fontSize: '0.82rem' }}>
                      Preview Page
                    </Link>

                    {ride.status === 'SCHEDULED' && (
                      <>
                        <Link to={`/rides/${ride.id}/edit`} className="btn btn-sm btn-outline" style={{ fontSize: '0.82rem' }}>
                          <Edit3 size={14} /> Edit
                        </Link>

                        <button
                          onClick={() => handleOpenCancelModal(ride)}
                          className="btn btn-sm btn-outline"
                          style={{ color: '#EF4444', borderColor: '#FECACA', fontSize: '0.82rem' }}
                        >
                          <XCircle size={14} /> Cancel Ride
                        </button>
                      </>
                    )}
                  </div>

                </div>

                {/* PASSENGERS ROSTER DRAWER */}
                {expandedRideId === ride.id && (
                  <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B192C', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={16} /> Confirmed Passengers ({rideBookings[ride.id]?.filter((b) => b.status === 'CONFIRMED').length || 0})
                    </h3>

                    {loadingBookings ? (
                      <LoadingSpinner size={20} text="Loading passenger list..." />
                    ) : !rideBookings[ride.id] || rideBookings[ride.id].length === 0 ? (
                      <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                        No passengers have booked seats on this ride yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {rideBookings[ride.id].map((b) => (
                          <div key={b.id} style={{
                            backgroundColor: '#FFFFFF',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: '1px solid #E2E8F0',
                          }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0F172A' }}>
                                {b.passenger?.fullName}
                              </div>
                              <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                                {b.passenger?.phone && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Phone size={12} /> {b.passenger.phone}
                                  </span>
                                )}
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Mail size={12} /> {b.passenger?.email}
                                </span>
                              </div>
                              {b.bookingNotes && (
                                <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '4px', fontStyle: 'italic' }}>
                                  "{b.bookingNotes}"
                                </div>
                              )}
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <span className={`badge badge-${b.status.toLowerCase()}`}>
                                {b.status}
                              </span>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                                {b.seatsBooked} {b.seatsBooked === 1 ? 'seat' : 'seats'} (${Number(b.totalPrice).toFixed(2)})
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Offered Ride"
        message={`Are you sure you want to cancel the ride from ${selectedRide?.sourceLocation} to ${selectedRide?.destinationLocation}? Any active passenger bookings will also be cancelled.`}
        confirmText="Yes, Cancel This Ride"
        confirmVariant="danger"
        isLoading={cancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelModalOpen(false)}
      />

      <style>{`
        @media (max-width: 768px) {
          .ride-meta-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyOfferedRidesPage;
