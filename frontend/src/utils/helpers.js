// Format date to readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Format currency
export const formatCurrency = (amount) => {
  if (amount == null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Calculate number of nights
export const calcNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

// Get status badge class
export const getStatusClass = (status) => {
  const map = {
    CONFIRMED: 'badge-confirmed',
    PENDING: 'badge-pending',
    CANCELLED: 'badge-cancelled',
    COMPLETED: 'badge-completed',
    SUCCESS: 'badge-confirmed',
    FAILED: 'badge-cancelled',
    REFUNDED: 'badge-pending',
    AVAILABLE: 'badge-confirmed',
    OCCUPIED: 'badge-pending',
    MAINTENANCE: 'badge-cancelled',
    INACTIVE: 'badge-cancelled',
  };
  return map[status] || 'badge-pending';
};

// Generate booking reference
export const generateRef = () => {
  return 'HB-' + Math.random().toString(36).substr(2, 8).toUpperCase();
};

// Get today's date as ISO string (YYYY-MM-DD)
export const today = () => new Date().toISOString().split('T')[0];

// Get tomorrow's date
export const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};
