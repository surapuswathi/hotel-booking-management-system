import { useEffect, useState } from "react";
import { adminService } from "../../services/services";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const res = await adminService.getAllBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateBookingStatus(id, status);
      loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1>Manage Bookings</h1>

      {bookings.map((booking) => (
        <div className="card" key={booking.id}>
          <h3>Booking #{booking.id}</h3>

          <p>Status: {booking.status}</p>
          <p>Total: ₹{booking.totalAmount}</p>

          <button
            onClick={() => updateStatus(booking.id, "CONFIRMED")}
          >
            Confirm
          </button>

          <button
            onClick={() => updateStatus(booking.id, "CANCELLED")}
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;