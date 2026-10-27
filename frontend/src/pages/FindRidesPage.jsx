import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { rideApi } from '../services/api';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  Filter, 
  AlertCircle 
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const FindRidesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [source, setSource] = useState(searchParams.get('source') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [seats, setSeats] = useState(searchParams.get('minSeats') || '1');

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRides = async (params) => {
    setLoading(true);
    setError('');
    try {
      const res = await rideApi.searchRides(params);
      if (res.success) {
        setRides(res.data || []);
      }
    } catch (err) {
      setError('Failed to fetch rides. Please check your network or backend server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {};
    if (searchParams.get('source')) params.source = searchParams.get('source');
    if (searchParams.get('destination')) params.destination = searchParams.get('destination');
    if (searchParams.get('date')) params.date = searchParams.get('date');
    if (searchParams.get('minSeats')) params.minSeats = searchParams.get('minSeats');

    fetchRides(params);
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (source.trim()) params.append('source', source.trim());
    if (destination.trim()) params.append('destination', destination.trim());
    if (date) params.append('date', date);
    if (seats && seats !== '1') params.append('minSeats', seats);

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSource('');
    setDestination('');
    setDate('');
    setSeats('1');
    setSearchParams(new URLSearchParams());
  };

  const formatDepartureDate = (dateTimeStr) => {
    try {
      const d = new Date(dateTimeStr);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
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

  return (
    <div className="page-wrapper">
      <div className="container">
        
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '28px' }}>
          <h1 className="page-title">Find Available Rides</h1>
          <p className="page-subtitle">
            Search scheduled trips offered by community drivers heading your way
          </p>
        </div>

        {/* Filter Bar Card */}
        <div className="card" style={{ padding: '20px', marginBottom: '32px' }}>
          <form onSubmit={handleFilterSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.2fr 1fr 0.8fr auto auto',
              gap: '12px',
              alignItems: 'flex-end',
            }} className="search-filter-grid">
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Origin</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Origin city"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                  <MapPin size={16} color="#2563EB" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Destination</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Destination city"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                  <MapPin size={16} color="#10B981" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Travel Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Min Seats</label>
                <select
                  className="form-select"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                >
                  <option value="1">1+ Seat</option>
                  <option value="2">2+ Seats</option>
                  <option value="3">3+ Seats</option>
                  <option value="4">4+ Seats</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
                <Search size={16} /> Filter
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-outline"
                style={{ height: '44px', color: '#64748B' }}
                title="Reset all filters"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Area */}
        <div>
          {loading ? (
            <LoadingSpinner text="Searching for matching rides..." />
          ) : error ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px', borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}>
              <AlertCircle size={32} color="#EF4444" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#B91C1C', fontWeight: 600 }}>{error}</p>
              <button onClick={() => fetchRides({})} className="btn btn-sm btn-outline" style={{ marginTop: '16px' }}>
                Retry Search
              </button>
            </div>
          ) : rides.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No rides match your criteria"
              message="Try broadening your search locations or selecting a different date. You can also offer a ride if you plan to drive."
              actionText="Offer a Ride"
              actionLink="/offer-ride"
            />
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Showing <strong>{rides.length}</strong> available {rides.length === 1 ? 'ride' : 'rides'}
                </span>
                <span className="badge badge-confirmed">Live backend data</span>
              </div>

              {rides.map((ride) => (
                <div key={ride.id} className="ride-card">
                  {/* Route & Times */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <span className="badge badge-scheduled" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {formatDepartureDate(ride.departureTime)}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B192C' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {formatDepartureTime(ride.departureTime)}
                      </span>
                    </div>

                    <div className="route-flow">
                      <div className="route-stop">
                        <div className="route-dot" />
                        <div>
                          <div className="route-city">{ride.sourceLocation}</div>
                        </div>
                      </div>

                      <div style={{ width: '2px', height: '16px', backgroundColor: '#E2E8F0', marginLeft: '5px' }} />

                      <div className="route-stop">
                        <div className="route-dot destination" />
                        <div>
                          <div className="route-city">{ride.destinationLocation}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver & Vehicle */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {ride.driver?.fullName?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0F172A' }}>
                          {ride.driver?.fullName || 'Community Driver'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Verified Driver</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748B' }}>
                      <Car size={14} />
                      <span>{ride.vehicleModel}</span>
                      {ride.vehicleNumber && <span>&middot; {ride.vehicleNumber}</span>}
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <span className="badge badge-seats">
                        <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {ride.availableSeats} of {ride.totalSeats} seats left
                      </span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: '12px' }}>
                    <div className="ride-price">
                      ${Number(ride.pricePerSeat).toFixed(2)}
                      <span> / seat</span>
                    </div>

                    <Link to={`/rides/${ride.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                      Details & Book <ArrowRight size={14} />
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .search-filter-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .search-filter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FindRidesPage;
