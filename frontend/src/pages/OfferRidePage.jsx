import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

const OfferRidePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    sourceLocation: '',
    destinationLocation: '',
    departureDate: '',
    departureTime: '',
    totalSeats: 3,
    pricePerSeat: '',
    vehicleModel: '',
    vehicleNumber: '',
    travelNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.sourceLocation.trim() || !formData.destinationLocation.trim()) {
      setError('Please provide both starting location and destination');
      return;
    }

    if (!formData.departureDate || !formData.departureTime) {
      setError('Please specify both departure date and time');
      return;
    }

    const departureDateTime = new Date(`${formData.departureDate}T${formData.departureTime}`);
    if (departureDateTime <= new Date()) {
      setError('Departure time must be set in the future');
      return;
    }

    const price = parseFloat(formData.pricePerSeat);
    if (isNaN(price) || price < 0) {
      setError('Please provide a valid non-negative price per seat');
      return;
    }

    if (!formData.vehicleModel.trim()) {
      setError('Vehicle model is required (e.g. Honda Civic)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        sourceLocation: formData.sourceLocation.trim(),
        destinationLocation: formData.destinationLocation.trim(),
        departureTime: `${formData.departureDate}T${formData.departureTime}:00`,
        totalSeats: Number(formData.totalSeats),
        pricePerSeat: price,
        vehicleModel: formData.vehicleModel.trim(),
        vehicleNumber: formData.vehicleNumber.trim() || null,
        travelNotes: formData.travelNotes.trim() || null,
      };

      const res = await rideApi.createRide(payload);
      if (res.success) {
        showToast('Your ride was published successfully!', 'success');
        navigate('/my-rides');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to publish ride';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '780px' }}>
        
        {/* Header */}
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 8px 16px rgba(37,99,235,0.25)'
          }}>
            <Car size={26} />
          </div>
          <h1 className="page-title">Offer a Ride</h1>
          <p className="page-subtitle">
            Fill your empty seats, share travel costs, and meet fellow travelers
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '36px' }}>
          
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              marginBottom: '24px',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Route Section */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B192C', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={18} color="#2563EB" /> 1. Route Coordinates
              </h3>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="sourceLocation">Starting Location</label>
                  <input
                    id="sourceLocation"
                    name="sourceLocation"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Austin, TX"
                    value={formData.sourceLocation}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="destinationLocation">Destination</label>
                  <input
                    id="destinationLocation"
                    name="destinationLocation"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Houston, TX"
                    value={formData.destinationLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Departure Section */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B192C', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={18} color="#2563EB" /> 2. Schedule & Pricing
              </h3>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="departureDate">Departure Date</label>
                  <input
                    id="departureDate"
                    name="departureDate"
                    type="date"
                    className="form-input"
                    value={formData.departureDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="departureTime">Departure Time</label>
                  <input
                    id="departureTime"
                    name="departureTime"
                    type="time"
                    className="form-input"
                    value={formData.departureTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="totalSeats">Available Passenger Seats</label>
                  <select
                    id="totalSeats"
                    name="totalSeats"
                    className="form-select"
                    value={formData.totalSeats}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Passenger Seat' : 'Passenger Seats'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pricePerSeat">Price per Seat ($ USD)</label>
                  <input
                    id="pricePerSeat"
                    name="pricePerSeat"
                    type="number"
                    step="0.50"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 25.00"
                    value={formData.pricePerSeat}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Section */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B192C', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Car size={18} color="#2563EB" /> 3. Vehicle Information
              </h3>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="vehicleModel">Vehicle Model</label>
                  <input
                    id="vehicleModel"
                    name="vehicleModel"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Toyota Camry (Blue)"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="vehicleNumber">License Plate (Optional)</label>
                  <input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    type="text"
                    className="form-input"
                    placeholder="e.g. TX-489-AB"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="travelNotes">Travel Notes & Passenger Guidelines (Optional)</label>
                <textarea
                  id="travelNotes"
                  name="travelNotes"
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Leaving from Central Metro. Trunk fits 2 medium suitcases. Quiet drive or playlists welcome."
                  value={formData.travelNotes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '12px' }}
            >
              {loading ? 'Publishing Ride...' : 'Publish Ride to Community'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default OfferRidePage;
