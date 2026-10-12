import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingService } from "../../services/services";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingService.getById(id);
        setBooking(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading booking...</div>;
  }

  if (error) {
    return <div style={{ padding: "40px" }}>{error}</div>;
  }

  if (!booking) {
    return <div style={{ padding: "40px" }}>Booking not found.</div>;
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <button onClick={() => navigate("/my-bookings")}>
        ← Back to My Bookings
      </button>

      <h1>Booking Details</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "25px",
          marginTop: "20px",
        }}
      >
        <h2>Booking #{booking.id}</h2>

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
          <strong>Number of Rooms:</strong>{" "}
          {booking.numberOfRooms || 1}
        </p>

        <p>
          <strong>Total Amount:</strong> ₹{booking.totalAmount}
        </p>

        {booking.room && (
          <>
            <h3>Room Information</h3>

            <p>
              <strong>Room:</strong>{" "}
              {booking.room.roomNumber || booking.room.id}
            </p>

            {booking.room.roomType && (
              <p>
                <strong>Room Type:</strong>{" "}
                {booking.room.roomType.name}
              </p>
            )}
          </>
        )}

        <div style={{ marginTop: "25px" }}>
          {booking.status === "CONFIRMED" && (
            <button
              onClick={() => navigate(`/booking-confirmation/${booking.id}`)}
            >
              View Confirmation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;