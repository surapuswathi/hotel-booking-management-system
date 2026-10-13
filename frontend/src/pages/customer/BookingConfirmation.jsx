import { useNavigate, useLocation, useParams } from "react-router-dom";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Support id from either route params or navigation state
  const bookingId = id || location.state?.bookingId;

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          textAlign: "center",
          padding: "3rem 2.5rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(6,214,160,0.15)",
            border: "2px solid var(--success)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "2.5rem",
          }}
        >
          🎉
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "0.75rem",
            background: "var(--grad-primary)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Booking Confirmed!
        </h1>

        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "1rem" }}>
          Your hotel booking has been successfully confirmed. We look forward to hosting you!
        </p>

        {bookingId && (
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem 1.25rem",
              marginBottom: "2rem",
              display: "inline-block",
            }}
          >
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Booking ID: </span>
            <strong style={{ color: "var(--primary-light)" }}>#{bookingId}</strong>
          </div>
        )}

        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
          A confirmation will be reflected in your bookings dashboard shortly.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/customer/bookings")}
            className="btn btn-primary"
          >
            View My Bookings
          </button>

          <button
            onClick={() => navigate("/hotels")}
            className="btn btn-secondary"
          >
            Browse More Hotels
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;