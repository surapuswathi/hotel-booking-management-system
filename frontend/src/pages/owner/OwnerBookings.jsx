import { useEffect, useState } from "react";
import { ownerService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_CLASSES = {
  PENDING: "badge-pending",
  CONFIRMED: "badge-confirmed",
  CANCELLED: "badge-cancelled",
  COMPLETED: "badge-completed",
};

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    ownerService
      .getBookings()
      .then((res) => setBookings(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.bookingStatus === filter);

  return (
    <div className="dashboard-layout">
      <Sidebar type="owner" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Hotel Bookings</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-secondary"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-content">
          {/* Summary row */}
          <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
            {[
              { label: "Total", val: bookings.length, cls: "primary" },
              { label: "Confirmed", val: bookings.filter((b) => b.bookingStatus === "CONFIRMED").length, cls: "success" },
              { label: "Pending", val: bookings.filter((b) => b.bookingStatus === "PENDING").length, cls: "warning" },
              { label: "Cancelled", val: bookings.filter((b) => b.bookingStatus === "CANCELLED").length, cls: "danger" },
            ].map(({ label, val, cls }) => (
              <div key={label} className={`stat-card ${cls}`}>
                <div className="stat-icon"><BookOpen size={20} /></div>
                <div className="stat-value">{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading bookings…</p>
          ) : filtered.length === 0 ? (
            <div className="table-container" style={{ padding: "3rem", textAlign: "center" }}>
              <BookOpen size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
              <p style={{ color: "var(--text-muted)" }}>No bookings found.</p>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <span className="table-title">Bookings ({filtered.length})</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Hotel / Room</th>
                    <th>Guest</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/customer/bookings/${b.id}`)}>
                      <td style={{ fontWeight: 700, color: "var(--primary-light)" }}>#{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.875rem" }}>
                          {b.hotel?.name || "—"}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          Room {b.room?.roomNumber}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.875rem" }}>{b.user?.fullName || "—"}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{b.user?.email}</div>
                      </td>
                      <td style={{ fontSize: "0.875rem" }}>{b.checkInDate}</td>
                      <td style={{ fontSize: "0.875rem" }}>{b.checkOutDate}</td>
                      <td style={{ fontWeight: 700, color: "var(--success)" }}>
                        ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className={`badge ${STATUS_CLASSES[b.bookingStatus] || "badge-pending"}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerBookings;