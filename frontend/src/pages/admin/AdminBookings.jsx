import { useEffect, useState } from "react";
import { adminService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { BookOpen, Check, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_CLASSES = {
  PENDING: "badge-pending",
  CONFIRMED: "badge-confirmed",
  CANCELLED: "badge-cancelled",
  COMPLETED: "badge-completed",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateBookingStatus(id, status);
      loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.bookingStatus === filter);

  return (
    <div className="dashboard-layout">
      <Sidebar type="admin" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Manage Bookings</h2>
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
                <span className="table-title">
                  Bookings ({filtered.length}{filter !== "ALL" ? ` · ${filter}` : ""})
                </span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Hotel / Room</th>
                    <th>Customer</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, color: "var(--primary-light)" }}>
                        #{b.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.875rem" }}>
                          {b.hotel?.name || "—"}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          Room {b.room?.roomNumber} · {b.room?.roomType?.name}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.875rem" }}>{b.user?.fullName || "—"}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{b.user?.email}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.82rem" }}>
                          <span style={{ color: "var(--text-muted)" }}>In: </span>{b.checkInDate}
                        </div>
                        <div style={{ fontSize: "0.82rem" }}>
                          <span style={{ color: "var(--text-muted)" }}>Out: </span>{b.checkOutDate}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: "var(--success)" }}>
                        ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className={`badge ${STATUS_CLASSES[b.bookingStatus] || "badge-pending"}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          {b.bookingStatus === "PENDING" && (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => updateStatus(b.id, "CONFIRMED")}
                                title="Confirm"
                              >
                                <Check size={13} />
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => updateStatus(b.id, "CANCELLED")}
                                title="Cancel"
                              >
                                <X size={13} />
                              </button>
                            </>
                          )}
                          {b.bookingStatus === "CONFIRMED" && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => updateStatus(b.id, "COMPLETED")}
                              title="Mark Completed"
                            >
                              Done
                            </button>
                          )}
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/customer/bookings/${b.id}`)}
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
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

export default AdminBookings;