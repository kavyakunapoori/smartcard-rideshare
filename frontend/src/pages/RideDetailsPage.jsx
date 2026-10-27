import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rideApi, bookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Car, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft, 
  FileText, 
  Phone, 
  Mail, 
  X 
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RideDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const fetchRide = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await rideApi.getRideById(id);
      if (res.success) {
        setRide(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ride not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRide();
  }, [id]);

  const isDriverOfRide = user && ride && user.id === ride.driver?.id;
  const isRideBookable = ride && ride.status === 'SCHEDULED' && ride.availableSeats > 0 && !isDriverOfRide;

  const handleOpenBookingModal = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/rides/${id}` } } });
      return;
    }
    setSeatsToBook(1);
    setBookingNotes('');
    setBookingError('');
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingLoading(true);

    try {
      const payload = {
        rideId: Number(id),
        seatsBooked: Number(seatsToBook),
        bookingNotes: bookingNotes.trim() || null,
      };

      const res = await bookingApi.bookRide(payload);
      if (res.success) {
        showToast(`Successfully booked ${seatsToBook} seat(s)!`, 'success');
        setIsBookingModalOpen(false);
        navigate('/my-bookings');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Please try again.';
      setBookingError(msg);
      showToast(msg, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDepartureDate = (dateTimeStr) => {
    try {
      const d = new Date(dateTimeStr);
      return d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateTimeStr;
    }
  };

  const formatDepartureTime = (dateTimeStr) => {
    try {
      const d = new Date(dateTimeStr);
      return d.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <LoadingSpinner text="Loading ride details..." />
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '40px', borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}>
            <AlertCircle size={36} color="#EF4444" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#B91C1C', marginBottom: '8px' }}>
              Ride Not Found
            </h2>
            <p style={{ color: '#7F1D1D', fontSize: '0.92rem', marginBottom: '20px' }}>
              {error || 'The requested ride could not be located or may have been cancelled.'}
            </p>
            <Link to="/rides" className="btn btn-primary btn-sm">
              <ArrowLeft size={16} /> Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPriceCalculated = (Number(ride.pricePerSeat) * seatsToBook).toFixed(2);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Back Link */}
        <Link to="/rides" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Search Results
        </Link>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1.2fr',
          gap: '32px',
        }} className="ride-details-grid">
          
          {/* LEFT: Route & Ride Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span className="badge badge-scheduled" style={{ fontSize: '0.8rem' }}>
                  {ride.status}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Trip ID #{ride.id}
                </span>
              </div>

              {/* Route Path */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '3px solid #2563EB',
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Pickup Location</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C' }}>{ride.sourceLocation}</div>
                  </div>
                </div>

                <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', marginLeft: '7px' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    border: '3px solid #10B981',
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Destination</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C' }}>{ride.destinationLocation}</div>
                  </div>
                </div>
              </div>

              {/* Date & Time Highlights */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={20} color="#2563EB" />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Departure Date</div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>
                      {formatDepartureDate(ride.departureTime)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={20} color="#2563EB" />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Departure Time</div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>
                      {formatDepartureTime(ride.departureTime)}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Vehicle & Travel Notes Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B192C', marginBottom: '16px' }}>
                Vehicle & Trip Specifics
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Car size={20} color="#64748B" />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Vehicle Model</div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{ride.vehicleModel}</div>
                  </div>
                </div>

                {ride.vehicleNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={20} color="#64748B" />
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Registration Plate</div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{ride.vehicleNumber}</div>
                    </div>
                  </div>
                )}
              </div>

              {ride.travelNotes && (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={16} /> Driver's Travel Notes
                  </div>
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    padding: '14px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#334155',
                    lineHeight: 1.6,
                    border: '1px solid #E2E8F0',
                  }}>
                    {ride.travelNotes}
                  </div>
                </div>
              )}
            </div>

            {/* Driver Profile Summary Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B192C', marginBottom: '16px' }}>
                Driver Information
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {ride.driver?.fullName?.charAt(0) || 'D'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>
                    {ride.driver?.fullName || 'Community Driver'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.82rem', fontWeight: 600, marginTop: '2px' }}>
                    <ShieldCheck size={14} /> Verified Member
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', fontSize: '0.88rem', color: '#64748B' }}>
                {ride.driver?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> {ride.driver.phone}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} /> {ride.driver?.email}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Booking Action Box */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '96px', borderTop: '4px solid #2563EB' }}>
              
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Price per Seat</div>
                  <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, color: '#0B192C' }}>
                    ${Number(ride.pricePerSeat).toFixed(2)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="badge badge-seats" style={{ fontSize: '0.85rem' }}>
                    <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {ride.availableSeats} of {ride.totalSeats} seats left
                  </div>
                </div>
              </div>

              {/* Status Warning Alerts */}
              {isDriverOfRide ? (
                <div style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  padding: '14px',
                  fontSize: '0.88rem',
                  color: '#1E40AF',
                  marginBottom: '16px',
                }}>
                  You are the driver of this ride. You cannot book your own ride. Manage your passengers in your dashboard.
                </div>
              ) : ride.availableSeats === 0 ? (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '14px',
                  fontSize: '0.88rem',
                  color: '#991B1B',
                  marginBottom: '16px',
                }}>
                  This ride is completely full. No seats are currently available.
                </div>
              ) : ride.status !== 'SCHEDULED' ? (
                <div style={{
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '14px',
                  fontSize: '0.88rem',
                  color: '#475569',
                  marginBottom: '16px',
                }}>
                  This ride is {ride.status.toLowerCase()} and cannot be booked.
                </div>
              ) : null}

              {/* Action Button */}
              {isDriverOfRide ? (
                <Link to="/my-rides" className="btn btn-secondary btn-block btn-lg">
                  Manage My Offered Rides
                </Link>
              ) : isAuthenticated ? (
                <button
                  onClick={handleOpenBookingModal}
                  disabled={!isRideBookable}
                  className="btn btn-primary btn-block btn-lg"
                >
                  Book Seats Now
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: { pathname: `/rides/${id}` } }}
                  className="btn btn-primary btn-block btn-lg"
                >
                  Sign in to Book
                </Link>
              )}

              <div style={{ marginTop: '20px', borderTop: '1px solid #F1F5F9', paddingTop: '16px', fontSize: '0.82rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="#10B981" /> Instant backend seat reservation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="#10B981" /> Cancel anytime with automatic seat restoration
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="#10B981" /> No hidden processing fees
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="modal-backdrop" onClick={() => !bookingLoading && setIsBookingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm Your Booking</h3>
              <button
                onClick={() => !bookingLoading && setIsBookingModalOpen(false)}
                className="modal-close"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="modal-body">
                
                {bookingError && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#B91C1C',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                  }}>
                    <AlertCircle size={16} />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>
                    {ride.sourceLocation} ➔ {ride.destinationLocation}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                    {formatDepartureDate(ride.departureTime)} at {formatDepartureTime(ride.departureTime)}
                  </div>
                </div>

                {/* Seat Selector */}
                <div className="form-group">
                  <label className="form-label" htmlFor="seats-select">Number of Seats to Reserve</label>
                  <select
                    id="seats-select"
                    className="form-select"
                    value={seatsToBook}
                    onChange={(e) => setSeatsToBook(Number(e.target.value))}
                    disabled={bookingLoading}
                  >
                    {Array.from({ length: Math.min(ride.availableSeats, 4) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Seat' : 'Seats'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Booking Notes */}
                <div className="form-group">
                  <label className="form-label" htmlFor="booking-notes">Notes for Driver (Optional)</label>
                  <textarea
                    id="booking-notes"
                    className="form-textarea"
                    rows={3}
                    placeholder="e.g. I have 1 carry-on bag, will meet at the station entrance"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    disabled={bookingLoading}
                  />
                </div>

                {/* Price Breakdown */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '8px',
                  border: '1px solid #BFDBFE',
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#1E40AF', fontWeight: 600 }}>Total Price:</span>
                  <span style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: '#1E3E62' }}>
                    ${totalPriceCalculated}
                  </span>
                </div>

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsBookingModalOpen(false)}
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Processing Booking...' : 'Confirm & Reserve Seat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .ride-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RideDetailsPage;
