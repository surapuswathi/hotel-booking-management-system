import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../../services/services";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Please login to view your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading bookings...</div>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>
      <h1>My Bookings</h1>

      {error && <p>{error}</p>}

      {!error && bookings.length === 0 && (
        <p>You don't have any bookings yet.</p>
      )}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "15px",
          }}
        >
          <h3>Booking #{booking.id}</h3>

          <p>
            <strong>Status:</strong> {booking.status}
          </p>

          <p>
            <strong>Check-in:</strong> {booking.checkInDate}
          </p>

          <p>
            <strong>Check-out:</strong> {booking.checkOutDate}
          </p>

          <p>
            <strong>Total:</strong> ₹{booking.totalAmount}
          </p>

          <button
            onClick={() => navigate(`/bookings/${booking.id}`)}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;