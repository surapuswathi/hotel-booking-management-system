import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';

// Customer Pages
import MyBookings from './pages/customer/MyBookings';
import BookingDetails from './pages/customer/BookingDetails';
import BookingPage from './pages/customer/BookingPage';
import PaymentPage from './pages/customer/PaymentPage';
import BookingConfirmation from './pages/customer/BookingConfirmation';
import Profile from './pages/customer/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHotels from './pages/admin/AdminHotels';
import AdminRooms from './pages/admin/AdminRooms';
import AdminRoomTypes from './pages/admin/AdminRoomTypes';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerHotels from './pages/owner/OwnerHotels';
import OwnerRooms from './pages/owner/OwnerRooms';
import OwnerBookings from './pages/owner/OwnerBookings';

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>

      {/* ==================== PUBLIC ROUTES ==================== */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/hotels" element={<Hotels />} />

      <Route path="/hotels/:id" element={<HotelDetails />} />


      {/* ==================== CUSTOMER ROUTES ==================== */}

      {/* My Bookings */}
      <Route
        path="/customer/bookings"
        element={
          <ProtectedRoute roles={['CUSTOMER', 'ADMIN', 'HOTEL_OWNER']}>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      {/* Booking Details */}
      <Route
        path="/customer/bookings/:id"
        element={
          <ProtectedRoute roles={['CUSTOMER', 'ADMIN', 'HOTEL_OWNER']}>
            <BookingDetails />
          </ProtectedRoute>
        }
      />

      {/* 
        IMPORTANT:
        HotelDetails.jsx navigates to:
        /booking/:roomId

        Example:
        /booking/5
      */}
      <Route
        path="/booking/:roomId"
        element={
          <ProtectedRoute roles={['CUSTOMER', 'ADMIN', 'HOTEL_OWNER']}>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      {/* Keep the original route as well */}
      <Route
        path="/customer/booking"
        element={
          <ProtectedRoute roles={['CUSTOMER', 'ADMIN', 'HOTEL_OWNER']}>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      {/* Payment */}
      <Route
  path="/customer/payment/:bookingId"
  element={
    <ProtectedRoute roles={["CUSTOMER", "ADMIN", "HOTEL_OWNER"]}>
      <PaymentPage />
    </ProtectedRoute>
  }
/>

      {/* Booking Confirmation */}
      <Route
        path="/customer/confirmation"
        element={
          <ProtectedRoute roles={['CUSTOMER', 'ADMIN', 'HOTEL_OWNER']}>
            <BookingConfirmation />
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute roles={['CUSTOMER', 'ADMIN', 'HOTEL_OWNER']}>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* ==================== ADMIN ROUTES ==================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/hotels"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminHotels />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminRooms />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/room-types"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminRoomTypes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />


      {/* ==================== OWNER ROUTES ==================== */}

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute roles={['HOTEL_OWNER', 'ADMIN']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/hotels"
        element={
          <ProtectedRoute roles={['HOTEL_OWNER', 'ADMIN']}>
            <OwnerHotels />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/rooms"
        element={
          <ProtectedRoute roles={['HOTEL_OWNER', 'ADMIN']}>
            <OwnerRooms />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/bookings"
        element={
          <ProtectedRoute roles={['HOTEL_OWNER', 'ADMIN']}>
            <OwnerBookings />
          </ProtectedRoute>
        }
      />


      {/* ==================== FALLBACK ==================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}