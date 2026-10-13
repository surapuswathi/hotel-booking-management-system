import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingService } from "../../services/services";
import Navbar from "../../components/Navbar";

const statusConfig = {
  CONFIRMED: { cls: "badge-confirmed", label: "Confirmed", icon: "✓", color: "var(--success)" },
  PENDING:   { cls: "badge-pending",   label: "Pending",   icon: "⏳", color: "var(--warning)" },
  CANCELLED: { cls: "badge-cancelled", label: "Cancelled", icon: "✕", color: "var(--danger)" },
  COMPLETED: { cls: "badge-completed", label: "Completed", icon: "★", color: "var(--info)" },
};

const DetailRow = ({ label, value, highlight }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.7rem 0",
      borderBottom: "1px solid var(--border)",
      fontSize: "0.875rem",
    }}
  >
    <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
    <span
      style={{
        fontWeight: 700,
        color: highlight ? "var(--primary-light)" : "var(--text-primary)",
        fontSize: highlight ? "1.05rem" : "inherit",
      }}
    >
      {value}
    </span>
  </div>
);

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setCancelling(true);
      await bookingService.cancel(id);
      setBooking((prev) => ({ ...prev, status: "CANCELLED" }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  const nights =
    booking?.checkInDate && booking?.checkOutDate
      ? Math.max(
          0,
          Math.round(
            (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "calc(100vh - 72px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
            color: "var(--text-muted)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid var(--border)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p>Loading booking…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "calc(100vh - 72px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "3rem" }}>😕</div>
          <h2 style={{ fontWeight: 700 }}>{error || "Booking not found."}</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/customer/bookings")}
          >
            Back to My Bookings
          </button>
        </div>
      </>
    );
  }

  const cfg = statusConfig[booking.status] || {
    cls: "badge-pending",
    label: booking.status,
    icon: "?",
    color: "var(--warning)",
  };

  return (
    <>
      <Navbar />

      {/* Hero strip */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "2.5rem 0 1.75rem",
        }}
      >
        <div className="container">
          <button
            onClick={() => navigate("/customer/bookings")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              marginBottom: "1rem",
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            ← Back to My Bookings
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.3rem" }}>
                Booking <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>#{booking.id}</span>
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Booked on {formatDate(booking.createdAt || booking.checkInDate)}
              </p>
            </div>
            <span className={`badge ${cfg.cls}`} style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
              {cfg.icon} {cfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }}>

          {/* Left: Booking info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Stay info */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>📅</span>
                <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Stay Details</h2>
              </div>
              <div style={{ padding: "1.25rem" }}>
                {/* Check-in / out visual */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    gap: "1rem",
                    alignItems: "center",
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.25rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Check‑in</p>
                    <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--success)" }}>{formatDate(booking.checkInDate)}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(108,99,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.25rem", fontSize: "1rem" }}>🌙</div>
                    <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary-light)" }}>{nights} night{nights !== 1 ? "s" : ""}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Check‑out</p>
                    <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--danger)" }}>{formatDate(booking.checkOutDate)}</p>
                  </div>
                </div>

                <DetailRow label="Number of Rooms" value={booking.numberOfRooms || 1} />
                <DetailRow label="Status" value={cfg.label} />
              </div>
            </div>

            {/* Room info */}
            {booking.room && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>🛏</span>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Room Information</h2>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <DetailRow label="Room Number" value={booking.room.roomNumber || `Room ${booking.room.id}`} />
                  {booking.room.roomType && (
                    <DetailRow label="Room Type" value={booking.room.roomType.name} />
                  )}
                  {booking.room.floor && (
                    <DetailRow label="Floor" value={booking.room.floor} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking summary + actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Payment summary */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              <div style={{ height: 4, background: "var(--grad-primary)" }} />
              <div style={{ padding: "1.25rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>💳 Payment Summary</h2>
                <DetailRow label="Booking ID" value={`#${booking.id}`} />
                {booking.room?.roomType?.pricePerNight && (
                  <DetailRow
                    label="Rate per night"
                    value={`₹${Number(booking.room.roomType.pricePerNight).toLocaleString("en-IN")}`}
                  />
                )}
                {nights > 0 && (
                  <DetailRow label="Nights" value={nights} />
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    borderTop: "2px solid var(--border)",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>Total Amount</span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "1.4rem",
                      background: "var(--grad-primary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.25rem" }}>Actions</h3>

              {booking.status === "PENDING" && (
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => navigate(`/customer/payment/${booking.id}`)}
                >
                  💳 Complete Payment
                </button>
              )}

              {booking.status === "CONFIRMED" && (
                <button
                  className="btn btn-secondary btn-full"
                  onClick={() =>
                    navigate("/customer/confirmation", { state: { bookingId: booking.id } })
                  }
                >
                  🎉 View Confirmation
                </button>
              )}

              {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                <button
                  className="btn btn-danger btn-full"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling…" : "✕ Cancel Booking"}
                </button>
              )}

              <button
                className="btn btn-secondary btn-full"
                onClick={() => navigate("/customer/bookings")}
              >
                ← Back to All Bookings
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default BookingDetails;