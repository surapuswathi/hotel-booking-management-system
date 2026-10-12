import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const hotelService = {
  getAll: (city) => api.get('/hotels', { params: city ? { city } : {} }),
  getById: (id) => api.get(`/hotels/${id}`),
  getRooms: (hotelId, checkInDate, checkOutDate) =>
    api.get(`/hotels/${hotelId}/rooms`, {
      params: {
        ...(checkInDate && { checkInDate }),
        ...(checkOutDate && { checkOutDate }),
      },
    }),
};

export const roomService = {
  getById: (id) => api.get(`/rooms/${id}`),
};

export const roomTypeService = {
  getAll: () => api.get('/room-types'),
  getById: (id) => api.get(`/room-types/${id}`),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

export const paymentService = {
  process: (data) => api.post('/payments', data),
  getById: (id) => api.get(`/payments/${id}`),
  getByBookingId: (bookingId) => api.get(`/payments/booking/${bookingId}`),
};

export const userService = {
  updateProfile: (data) => api.put('/customer/profile', data),
  changePassword: (data) => api.put('/customer/change-password', data),
};

// Admin services
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getReports: () => api.get('/admin/reports'),

  // Hotels
  getAllHotels: () => api.get('/admin/hotels'),
  createHotel: (data) => api.post('/admin/hotels', data),
  updateHotel: (id, data) => api.put(`/admin/hotels/${id}`, data),
  deleteHotel: (id) => api.delete(`/admin/hotels/${id}`),

  // Rooms
  createRoom: (data) => api.post('/admin/rooms', data),
  updateRoom: (id, data) => api.put(`/admin/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/admin/rooms/${id}`),

  // Room Types
  createRoomType: (data) => api.post('/admin/room-types', data),
  updateRoomType: (id, data) => api.put(`/admin/room-types/${id}`, data),
  deleteRoomType: (id) => api.delete(`/admin/room-types/${id}`),

  // Bookings
  getAllBookings: () => api.get('/admin/bookings'),
  updateBookingStatus: (id, status) =>
    api.put(`/admin/bookings/${id}/status`, null, { params: { status } }),

  // Users
  getAllUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id, active) =>
    api.put(`/admin/users/${id}/status`, null, { params: { active } }),
};

// Owner services
export const ownerService = {
  getDashboard: () => api.get('/owner/dashboard'),
  getHotels: () => api.get('/owner/hotels'),
  createHotel: (data) => api.post('/owner/hotels', data),
  updateHotel: (id, data) => api.put(`/owner/hotels/${id}`, data),
  createRoom: (data) => api.post('/owner/rooms', data),
  updateRoom: (id, data) => api.put(`/owner/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/owner/rooms/${id}`),
  getBookings: () => api.get('/owner/bookings'),
};
