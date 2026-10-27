import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingApi, rideApi } from '../services/api';
import { 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  PlusCircle, 
  Search, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  CheckCircle 
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [offeredRides, setOfferedRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, ridesRes] = await Promise.allSettled([
          bookingApi.getMyBookings(),
          rideApi.getMyRides(),
        ]);

        if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success) {
          setBookings(bookingsRes.value.data || []);
        }

        if (ridesRes.status === 'fulfilled' && ridesRes.value.success) {
          setOfferedRides(ridesRes.value.data || []);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const activeOfferedRides = offeredRides.filter((r) => r.status === 'SCHEDULED');

  const totalSpent = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

  const formatShortDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Member Dashboard</span>
              {isAdmin && (
                <span className="badge badge-admin">
                  <ShieldCheck size={12} /> Platform Admin
                </span>
              )}
            </div>
            <h1 className="page-title">
              Hello, {user?.fullName || 'Traveler'}
            </h1>
            <p className="page-subtitle">
              Here is your active carpooling overview and travel itinerary
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/rides" className="btn btn-outline btn-sm">
              <Search size={16} /> Search Rides
            </Link>
            <Link to="/offer-ride" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Offer a Ride
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '36px',
        }} className="metrics-grid">
          
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Active Bookings</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={18} />
              </div>
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>
              {activeBookings.length}
            </div>
            <Link to="/my-bookings" style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              View all bookings <ArrowRight size={12} />
            </Link>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Offered Trips</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={18} />
              </div>
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>
              {activeOfferedRides.length}
            </div>
            <Link to="/my-rides" style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              Manage offered rides <ArrowRight size={12} />
            </Link>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Total Travel Spent</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FAF5FF', color: '#7E22CE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>
              ${totalSpent.toFixed(2)}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginTop: '6px' }}>
              Confirmed rides
            </span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Account Profile</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName?.split(' ')[0]}
            </div>
            <Link to="/profile" style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              Edit profile <ArrowRight size={12} />
            </Link>
          </div>

        </div>

        {/* TWO COLUMN SUMMARY */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
        }} className="dashboard-grid">
          
          {/* Upcoming Bookings Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 700, color: '#0B192C' }}>
                My Upcoming Bookings
              </h2>
              <Link to="/my-bookings" style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 600 }}>
                View All
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner size={24} text="Loading bookings..." />
            ) : activeBookings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '36px 20px', borderStyle: 'dashed' }}>
                <Calendar size={32} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '14px' }}>
                  You don't have any upcoming booked rides.
                </p>
                <Link to="/rides" className="btn btn-sm btn-primary">
                  Find a Ride
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeBookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="card card-hover" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-confirmed" style={{ fontSize: '0.72rem' }}>
                        {b.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {formatShortDate(b.ride?.departureTime)}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem', marginBottom: '6px' }}>
                      {b.ride?.sourceLocation} ➔ {b.ride?.destinationLocation}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748B' }}>
                      <span>Driver: {b.ride?.driver?.fullName}</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>
                        {b.seatsBooked} {b.seatsBooked === 1 ? 'seat' : 'seats'} (${Number(b.totalPrice).toFixed(2)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offered Rides Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 700, color: '#0B192C' }}>
                My Offered Rides
              </h2>
              <Link to="/my-rides" style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 600 }}>
                View All
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner size={24} text="Loading offered rides..." />
            ) : activeOfferedRides.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '36px 20px', borderStyle: 'dashed' }}>
                <Car size={32} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '14px' }}>
                  You haven't offered any upcoming trips yet.
                </p>
                <Link to="/offer-ride" className="btn btn-sm btn-primary">
                  Publish a Trip
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeOfferedRides.slice(0, 3).map((r) => (
                  <div key={r.id} className="card card-hover" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-scheduled" style={{ fontSize: '0.72rem' }}>
                        {r.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {formatShortDate(r.departureTime)}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem', marginBottom: '6px' }}>
                      {r.sourceLocation} ➔ {r.destinationLocation}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748B' }}>
                      <span>{r.availableSeats} of {r.totalSeats} seats open</span>
                      <span style={{ fontWeight: 700, color: '#10B981' }}>
                        ${Number(r.pricePerSeat).toFixed(2)}/seat
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .metrics-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
