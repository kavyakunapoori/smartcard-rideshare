import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rideApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  FileText, 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditRidePage = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    sourceLocation: '',
    destinationLocation: '',
    departureDate: '',
    departureTime: '',
    pricePerSeat: '',
    vehicleModel: '',
    vehicleNumber: '',
    travelNotes: '',
    status: 'SCHEDULED',
  });

  useEffect(() => {
    const fetchRide = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await rideApi.getRideById(id);
        if (res.success && res.data) {
          const r = res.data;
          // Check ownership
          if (!isAdmin && r.driver?.id !== user?.id) {
            showToast('You do not have permission to edit this ride', 'error');
            navigate('/my-rides');
            return;
          }

          let datePart = '';
          let timePart = '';
          if (r.departureTime) {
            const dt = new Date(r.departureTime);
            datePart = dt.toISOString().split('T')[0];
            timePart = dt.toTimeString().substring(0, 5);
          }

          setFormData({
            sourceLocation: r.sourceLocation,
            destinationLocation: r.destinationLocation,
            departureDate: datePart,
            departureTime: timePart,
            pricePerSeat: r.pricePerSeat,
            vehicleModel: r.vehicleModel,
            vehicleNumber: r.vehicleNumber || '',
            travelNotes: r.travelNotes || '',
            status: r.status,
          });
        }
      } catch (err) {
        setError('Failed to fetch ride information for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [id, user, isAdmin, navigate, showToast]);

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

    const price = parseFloat(formData.pricePerSeat);
    if (isNaN(price) || price < 0) {
      setError('Please provide a valid non-negative price per seat');
      return;
    }

    if (!formData.departureDate || !formData.departureTime) {
      setError('Please provide both date and time');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        departureTime: `${formData.departureDate}T${formData.departureTime}:00`,
        pricePerSeat: price,
        vehicleModel: formData.vehicleModel.trim(),
        vehicleNumber: formData.vehicleNumber.trim() || null,
        travelNotes: formData.travelNotes.trim() || null,
        status: formData.status,
      };

      const res = await rideApi.updateRide(id, payload);
      if (res.success) {
        showToast('Ride details updated successfully', 'success');
        navigate('/my-rides');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update ride';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
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

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '720px' }}>
        
        <Link to="/my-rides" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to My Rides
        </Link>

        <div className="page-header" style={{ marginBottom: '28px' }}>
          <h1 className="page-title">Edit Offered Ride</h1>
          <p className="page-subtitle">
            Update schedule, pricing, or vehicle information for {formData.sourceLocation} ➔ {formData.destinationLocation}
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          
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
              marginBottom: '20px',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Read-only Route Summary */}
            <div style={{
              padding: '14px 18px',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              marginBottom: '24px',
            }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Trip Route</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                {formData.sourceLocation} ➔ {formData.destinationLocation}
              </div>
            </div>

            {/* Departure */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-date">Departure Date</label>
                <input
                  id="edit-date"
                  name="departureDate"
                  type="date"
                  className="form-input"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-time">Departure Time</label>
                <input
                  id="edit-time"
                  name="departureTime"
                  type="time"
                  className="form-input"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Price & Status */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-price">Price per Seat ($ USD)</label>
                <input
                  id="edit-price"
                  name="pricePerSeat"
                  type="number"
                  step="0.50"
                  min="0"
                  className="form-input"
                  value={formData.pricePerSeat}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-status">Ride Status</label>
                <select
                  id="edit-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Vehicle */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-vehicle">Vehicle Model</label>
                <input
                  id="edit-vehicle"
                  name="vehicleModel"
                  type="text"
                  className="form-input"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-plate">Vehicle License Plate</label>
                <input
                  id="edit-plate"
                  name="vehicleNumber"
                  type="text"
                  className="form-input"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label" htmlFor="edit-notes">Travel Notes / Instructions</label>
              <textarea
                id="edit-notes"
                name="travelNotes"
                className="form-textarea"
                rows={3}
                value={formData.travelNotes}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Link to="/my-rides" className="btn btn-outline btn-sm">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={saving}
              >
                {saving ? 'Saving Changes...' : 'Save Updates'}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};

export default EditRidePage;
