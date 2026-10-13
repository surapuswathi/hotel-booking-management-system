import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { paymentService, bookingService } from "../../services/services";
import Navbar from "../../components/Navbar";

const paymentMethods = [
  {
    id: "CARD",
    icon: "💳",
    label: "Credit / Debit Card",
    desc: "Visa, Mastercard, RuPay",
  },
  {
    id: "UPI",
    icon: "📱",
    label: "UPI",
    desc: "Google Pay, PhonePe, Paytm",
  },
  {
    id: "CASH",
    icon: "💵",
    label: "Cash at Hotel",
    desc: "Pay on arrival",
  },
];

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [method, setMethod] = useState("CARD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  // Load booking details for the summary
  useEffect(() => {
    if (!bookingId) return;
    bookingService
      .getById(bookingId)
      .then((r) => setBooking(r.data.data))
      .catch(() => {});
  }, [bookingId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await paymentService.process({
        bookingId: Number(bookingId),
        paymentMethod: method,
      });
      const payment = response.data.data;
      if (payment) {
        navigate(`/customer/confirmation`, { state: { bookingId } });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
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
      : null;

  return (
    <>
      <Navbar />

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "2.5rem 0 1.75rem",
        }}
      >
        <div className="container">
          <button
            onClick={() => navigate(-1)}
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
            ← Go Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-md)",
                background: "rgba(108,99,255,0.15)",
                border: "1px solid rgba(108,99,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              💳
            </div>
            <div>
              <h1
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  background: "var(--grad-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Secure Payment
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Complete your booking #{bookingId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "1.5rem",
            alignItems: "start",
            maxWidth: 960,
            margin: "0 auto",
          }}
        >
          {/* Payment form */}
          <div>
            <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {error && (
                <div className="alert alert-error">⚠ {error}</div>
              )}

              {/* Secure badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  background: "rgba(6,214,160,0.08)",
                  border: "1px solid rgba(6,214,160,0.25)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.82rem",
                  color: "var(--success)",
                  fontWeight: 600,
                }}
              >
                🔒 This is a 100% secure payment
              </div>

              {/* Payment method selection */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Select Payment Method</h2>
                </div>
                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {paymentMethods.map((pm) => (
                    <label
                      key={pm.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem 1.25rem",
                        borderRadius: "var(--radius-md)",
                        border:
                          method === pm.id
                            ? "2px solid var(--primary)"
                            : "1px solid var(--border)",
                        background:
                          method === pm.id
                            ? "rgba(108,99,255,0.1)"
                            : "var(--bg-elevated)",
                        cursor: "pointer",
                        transition: "var(--transition)",
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={method === pm.id}
                        onChange={() => setMethod(pm.id)}
                        style={{ display: "none" }}
                      />
                      {/* Custom radio */}
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border:
                            method === pm.id
                              ? "6px solid var(--primary)"
                              : "2px solid var(--border-strong)",
                          flexShrink: 0,
                          transition: "var(--transition)",
                        }}
                      />
                      <div style={{ fontSize: "1.5rem" }}>{pm.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.1rem" }}>
                          {pm.label}
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {pm.desc}
                        </p>
                      </div>
                      {method === pm.id && (
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Pay button */}
              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
                style={{ fontSize: "1rem", letterSpacing: "0.02em" }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        border: "3px solid rgba(255,255,255,0.4)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        display: "inline-block",
                      }}
                    />
                    Processing Payment…
                  </span>
                ) : (
                  <>🔐 Pay Now{booking ? ` — ₹${Number(booking.totalAmount || 0).toLocaleString("en-IN")}` : ""}</>
                )}
              </button>
            </form>
          </div>

          {/* Right: Order summary */}
          <div>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                position: "sticky",
                top: "88px",
              }}
            >
              <div style={{ height: 4, background: "var(--grad-primary)" }} />
              <div style={{ padding: "1.25rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                  Order Summary
                </h2>

                {booking ? (
                  <>
                    {/* Booking ID */}
                    <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
                        Booking Reference
                      </p>
                      <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary-light)" }}>
                        #{booking.id}
                      </p>
                    </div>

                    {/* Dates */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                      {[
                        { label: "Check‑in", value: formatDate(booking.checkInDate) },
                        { label: "Check‑out", value: formatDate(booking.checkOutDate) },
                        ...(nights !== null ? [{ label: "Duration", value: `${nights} night${nights !== 1 ? "s" : ""}` }] : []),
                        { label: "Rooms", value: booking.numberOfRooms || 1 },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "0.6rem 0",
                            borderBottom: "1px solid var(--border)",
                            fontSize: "0.85rem",
                          }}
                        >
                          <span style={{ color: "var(--text-muted)" }}>{label}</span>
                          <span style={{ fontWeight: 600 }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "1rem",
                        paddingTop: "1rem",
                        borderTop: "2px solid var(--border)",
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>Total</span>
                      <span
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: 800,
                          background: "var(--grad-primary)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Loading booking details…
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default PaymentPage;
