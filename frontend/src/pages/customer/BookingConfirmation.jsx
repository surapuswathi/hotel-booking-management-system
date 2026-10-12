import { useNavigate, useParams } from "react-router-dom";

const BookingConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          padding: "40px",
          border: "1px solid #ddd",
          borderRadius: "12px",
        }}
      >
        <h1>Booking Confirmed! 🎉</h1>

        <p>Your hotel booking has been successfully confirmed.</p>

        {id && (
          <p>
            <strong>Booking ID:</strong> {id}
          </p>
        )}

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => navigate("/my-bookings")}
            style={{ marginRight: "10px" }}
          >
            View My Bookings
          </button>

          <button onClick={() => navigate("/hotels")}>
            Browse Hotels
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;