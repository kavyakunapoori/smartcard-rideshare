import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authApi = {
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  login: (data) => api.post('/auth/login', data).then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
};

// User Endpoints
export const userApi = {
  getProfile: () => api.get('/users/me').then((res) => res.data),
  updateProfile: (data) => api.put('/users/me', data).then((res) => res.data),
  changePassword: (data) => api.put('/users/me/password', data).then((res) => res.data),
};

// Ride Endpoints
export const rideApi = {
  searchRides: (params) => api.get('/rides', { params }).then((res) => res.data),
  getRideById: (id) => api.get(`/rides/${id}`).then((res) => res.data),
  createRide: (data) => api.post('/rides', data).then((res) => res.data),
  updateRide: (id, data) => api.put(`/rides/${id}`, data).then((res) => res.data),
  cancelRide: (id) => api.delete(`/rides/${id}`).then((res) => res.data),
  getMyRides: () => api.get('/rides/mine').then((res) => res.data),
  getRideBookings: (rideId) => api.get(`/rides/${rideId}/bookings`).then((res) => res.data),
};

// Booking Endpoints
export const bookingApi = {
  bookRide: (data) => api.post('/bookings', data).then((res) => res.data),
  getMyBookings: () => api.get('/bookings/mine').then((res) => res.data),
  getBookingById: (id) => api.get(`/bookings/${id}`).then((res) => res.data),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`).then((res) => res.data),
};

// Admin Endpoints
export const adminApi = {
  getStats: () => api.get('/admin/stats').then((res) => res.data),
  getUsers: () => api.get('/admin/users').then((res) => res.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((res) => res.data),
  getRides: () => api.get('/admin/rides').then((res) => res.data),
  cancelRide: (id) => api.patch(`/admin/rides/${id}/cancel`).then((res) => res.data),
};

// Health Endpoint
export const healthApi = {
  checkHealth: () => api.get('/health').then((res) => res.data),
};

export default api;
