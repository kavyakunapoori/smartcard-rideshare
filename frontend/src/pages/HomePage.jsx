import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  PiggyBank, 
  Leaf, 
  Car, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Sparkles 
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (source.trim()) params.append('source', source.trim());
    if (destination.trim()) params.append('destination', destination.trim());
    if (date) params.append('date', date);
    if (seats > 1) params.append('minSeats', seats);
    navigate(`/rides?${params.toString()}`);
  };

  const sampleCorridors = [
    { from: 'New York, NY', to: 'Boston, MA', estTime: '4h 15m', avgPrice: '$35', seats: '3 seats avg' },
    { from: 'San Francisco, CA', to: 'San Jose, CA', estTime: '1h 10m', avgPrice: '$18', seats: '4 seats avg' },
    { from: 'Austin, TX', to: 'Houston, TX', estTime: '2h 45m', avgPrice: '$28', seats: '3 seats avg' },
    { from: 'Seattle, WA', to: 'Portland, OR', estTime: '3h 10m', avgPrice: '$30', seats: '2 seats avg' },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        backgroundColor: '#0B192C',
        color: '#FFFFFF',
        padding: '70px 0 90px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(11,25,44,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }}>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: '0.85rem',
              color: '#93C5FD',
              marginBottom: '20px',
              fontWeight: 600,
            }}>
              <Sparkles size={14} color="#60A5FA" />
              Next-Generation Intercity & Campus Carpooling
            </div>

            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}>
              Share Your Ride. <span style={{ color: '#008DDA' }}>Split the Cost.</span><br />
              <span style={{ color: '#10B981' }}>Travel Smarter.</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: '#94A3B8',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 28px',
            }}>
              Connect with verified drivers and riders traveling your way. Lower your transportation expenses, eliminate empty seats, and build a greener future.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/rides" className="btn btn-lg btn-primary">
                <Search size={18} /> Find a Ride
              </Link>
              <Link to="/offer-ride" className="btn btn-lg btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)' }}>
                <Car size={18} /> Offer a Ride
              </Link>
            </div>
          </div>

          {/* QUICK SEARCH WIDGET */}
          <div className="search-widget" style={{ maxWidth: '1060px', margin: '0 auto' }}>
            <form onSubmit={handleSearch} className="search-fields">
              
              {/* Origin */}
              <div className="search-field-item">
                <MapPin size={18} color="#2563EB" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Leaving from (e.g. New York)"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  aria-label="Origin City"
                />
              </div>

              {/* Destination */}
              <div className="search-field-item">
                <Compass size={18} color="#10B981" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Going to (e.g. Boston)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  aria-label="Destination City"
                />
              </div>

              {/* Date */}
              <div className="search-field-item">
                <Calendar size={18} color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label="Travel Date"
                />
              </div>

              {/* Passengers */}
              <div className="search-field-item">
                <Users size={18} color="#64748B" style={{ flexShrink: 0 }} />
                <select
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  aria-label="Number of Seats"
                >
                  <option value={1}>1 Seat</option>
                  <option value={2}>2 Seats</option>
                  <option value={3}>3 Seats</option>
                  <option value={4}>4 Seats</option>
                </select>
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', height: '100%' }}>
                <Search size={18} /> Search
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* STATS HIGHLIGHT BANNER */}
      <section style={{ backgroundColor: '#132742', color: '#FFFFFF', padding: '28px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            textAlign: 'center',
          }} className="stats-grid">
            <div>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#60A5FA' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Verified User Profiles</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#34D399' }}>Up to 70%</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Travel Cost Savings</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24' }}>Zero</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Hidden Platform Fees</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: '#F472B6' }}>Real-Time</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Seat Locking & Tracking</div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </section>

      {/* THREE VALUE PILLARS */}
      <section className="page-wrapper" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '2.1rem', fontWeight: 700, color: '#0B192C', marginBottom: '12px' }}>
              Why Choose Smart Carpool?
            </h2>
            <p style={{ color: '#64748B' }}>
              Designed for everyday travelers and students looking for a reliable, economical, and community-first commuting experience.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px',
          }} className="features-grid">
            
            {/* Card 1 */}
            <div className="card card-hover" style={{ padding: '32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <PiggyBank size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#0F172A' }}>
                Save Up to 70% on Costs
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Gasoline, toll fees, and highway wear-and-tear add up quickly. By pooling with passengers heading your way, you split travel expenses fairly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card card-hover" style={{ padding: '32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Leaf size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#0F172A' }}>
                Eco-Friendly Commutes
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Fill empty vehicle seats instead of having multiple single-occupancy cars on the highway. Directly lower carbon emissions and reduce city congestion.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card card-hover" style={{ padding: '32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#F5F3FF',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#0F172A' }}>
                Safe & Verified Network
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Every rider and driver profile includes verified phone contacts and transparent trip histories. Atomic seat reservations prevent overbooking.
              </p>
            </div>

          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .features-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="page-wrapper" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 52px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '2.1rem', fontWeight: 700, color: '#0B192C', marginTop: '6px' }}>
              How Carpooling Works
            </h2>
            <p style={{ color: '#64748B' }}>
              Booking or offering a ride takes less than two minutes from your phone or laptop.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '36px',
            position: 'relative',
          }} className="steps-grid">
            
            {/* Step 1 */}
            <div style={{ textAlign: 'center', padding: '0 12px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                border: '2px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 800,
                margin: '0 auto 20px',
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Search or Offer</h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Enter your pickup city, destination, and travel date. Filter by available seats and departure time range.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ textAlign: 'center', padding: '0 12px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                border: '2px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 800,
                margin: '0 auto 20px',
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Reserve Seats Instantly</h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Review the driver's vehicle details and transparent seat price. Reserve 1 to 4 seats with live seat confirmation.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ textAlign: 'center', padding: '0 12px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#FAF5FF',
                color: '#8B5CF6',
                border: '2px solid #DDD6FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 800,
                margin: '0 auto 20px',
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Meet & Travel</h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Coordinate convenient pickup points, meet your co-travelers, and enjoy a safe and comfortable ride together.
              </p>
            </div>

          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .steps-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </section>

      {/* POPULAR EXAMPLE ROUTES */}
      <section className="page-wrapper" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '36px',
          }}>
            <div>
              <span className="badge badge-scheduled" style={{ marginBottom: '8px' }}>Example Travel Corridors</span>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700, color: '#0B192C' }}>
                Frequently Traveled Routes
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                Explore popular routes with active drivers and scheduled departures.
              </p>
            </div>
            <Link to="/rides" className="btn btn-outline-primary btn-sm">
              Explore All Rides <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }} className="corridors-grid">
            {sampleCorridors.map((route, i) => (
              <div key={i} className="card card-hover" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {route.estTime}
                  </span>
                  <span style={{ fontWeight: 800, color: '#10B981', fontSize: '1.1rem' }}>
                    {route.avgPrice}
                  </span>
                </div>

                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '1rem', marginBottom: '4px' }}>
                  {route.from}
                </div>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '4px' }}>
                  to
                </div>
                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '1rem', marginBottom: '16px' }}>
                  {route.to}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{route.seats}</span>
                  <Link
                    to={`/rides?source=${encodeURIComponent(route.from.split(',')[0])}&destination=${encodeURIComponent(route.to.split(',')[0])}`}
                    style={{ color: '#2563EB', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    View <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 1024px) {
            .corridors-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 600px) {
            .corridors-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* TRUST & SAFETY SECTION */}
      <section className="page-wrapper" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
          }} className="safety-grid">
            
            <div>
              <span className="badge badge-confirmed" style={{ marginBottom: '12px' }}>Trust & Safety First</span>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 700, color: '#0B192C', lineHeight: 1.25, marginBottom: '20px' }}>
                Your Peace of Mind is Our Highest Priority
              </h2>
              <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                We believe shared mobility thrives on mutual trust, clear expectations, and transparent accountability.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#0F172A', fontSize: '0.95rem' }}>Verified Driver & Vehicle Information</strong>
                    <span style={{ color: '#64748B', fontSize: '0.88rem' }}>Check vehicle model, registration plates, and contact information before boarding.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#0F172A', fontSize: '0.95rem' }}>Anti-Overbooking Seat Locking</strong>
                    <span style={{ color: '#64748B', fontSize: '0.88rem' }}>Database transactions guarantee you never arrive at a car with insufficient seating.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#0F172A', fontSize: '0.95rem' }}>Transparent One-Click Cancellations</strong>
                    <span style={{ color: '#64748B', fontSize: '0.88rem' }}>Cancel your booking if plans change; seats are instantly restored to the community pool.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '36px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>Safety Commitment</h4>
                  <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Smart Carpool Community Guidelines</span>
                </div>
              </div>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                "Drivers cannot book their own rides, passengers cannot book more seats than available, and all modifications are validated on our secure Spring Boot backend."
              </p>
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748B' }}>
                <span>Backend Security Standard</span>
                <span className="badge badge-scheduled">BCrypt + JWT</span>
              </div>
            </div>

          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .safety-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section style={{ backgroundColor: '#0B192C', color: '#FFFFFF', padding: '64px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 700, marginBottom: '14px' }}>
            Ready to Travel Smarter?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Join our community today. Discover rides along your commute or offer empty seats to start saving on travel expenses immediately.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg btn-primary">
              Create Free Account
            </Link>
            <Link to="/rides" className="btn btn-lg btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
              Browse Available Rides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
