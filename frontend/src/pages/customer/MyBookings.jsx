import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../../services/services";
import Navbar from "../../components/Navbar";

const statusConfig = {
  CONFIRMED: { cls: "badge-confirmed", label: "Confirmed", icon: "✓" },
  PENDING:   { cls: "badge-pending",   label: "Pending",   icon: "⏳" },
  CANCELLED: { cls: "badge-cancelled", label: "Cancelled", icon: "✕" },
  COMPLETED: { cls: "badge-completed", label: "Completed", icon: "★" },
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
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

  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const nights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diff =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

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
          <p>Loading your bookings…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Page header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "3rem 0 2rem",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-md)",
                background: "rgba(108,99,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              📋
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
                My Bookings
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
            ⚠ {error}
          </div>
        )}

        {/* Filter tabs */}
        {!error && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.75rem",
              flexWrap: "wrap",
            }}
          >
            {["ALL", "CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    border:
                      filter === s
                        ? "1px solid var(--primary)"
                        : "1px solid var(--border)",
                    background:
                      filter === s
                        ? "rgba(108,99,255,0.18)"
                        : "var(--bg-card)",
                    color:
                      filter === s ? "var(--primary-light)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                >
                  {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                  {s !== "ALL" && (
                    <span
                      style={{ marginLeft: "0.4rem", opacity: 0.7 }}
                    >
                      ({bookings.filter((b) => b.status === s).length})
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        )}

        {/* Empty state */}
        {!error && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏨</div>
            <h3
              style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}
            >
              No bookings yet
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
              }}
            >
              {filter === "ALL"
                ? "Explore our hotels and make your first booking!"
                : `No ${filter.toLowerCase()} bookings found.`}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/hotels")}
            >
              Browse Hotels
            </button>
          </div>
        )}

        {/* Booking cards grid */}
        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          }}
        >
          {filtered.map((booking) => {
            const cfg = statusConfig[booking.status] || {
              cls: "badge-pending",
              label: booking.status,
              icon: "?",
            };
            const n = nights(booking.checkInDate, booking.checkOutDate);

            return (
              <div
                key={booking.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  transition: "var(--transition)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow = "var(--shadow-primary)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
                onClick={() => navigate(`/customer/bookings/${booking.id}`)}
              >
                {/* Card top stripe */}
                <div
                  style={{
                    height: 4,
                    background:
                      booking.status === "CONFIRMED"
                        ? "var(--success)"
                        : booking.status === "CANCELLED"
                        ? "var(--danger)"
                        : booking.status === "COMPLETED"
                        ? "var(--info)"
                        : "var(--warning)",
                  }}
                />

                <div style={{ padding: "1.25rem" }}>
                  {/* Header row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.2rem",
                        }}
                      >
                        Booking
                      </p>
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        #{booking.id}
                      </h3>
                    </div>
                    <span className={`badge ${cfg.cls}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>

                  {/* Dates */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto 1fr",
                      gap: "0.5rem",
                      alignItems: "center",
                      marginBottom: "1rem",
                      background: "var(--bg-elevated)",
                      borderRadius: "var(--radius-md)",
                      padding: "0.75rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.2rem",
                        }}
                      >
                        Check‑in
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {formatDate(booking.checkInDate)}
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                      }}
                    >
                      <div style={{ fontSize: "1rem" }}>→</div>
                      <div>{n} night{n !== 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.2rem",
                        }}
                      >
                        Check‑out
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {formatDate(booking.checkOutDate)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          fontWeight: 600,
                        }}
                      >
                        Total
                      </p>
                      <p
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 800,
                          color: "var(--primary-light)",
                        }}
                      >
                        ₹{(booking.totalAmount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customer/bookings/${booking.id}`);
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MyBookings;