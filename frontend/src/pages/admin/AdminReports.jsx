import { useEffect, useState } from "react";
import { adminService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { BarChart3, TrendingUp, DollarSign, BookOpen, CheckCircle, XCircle, Star } from "lucide-react";

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getReports()
      .then((res) => setReport(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="dashboard-layout">
      <Sidebar type="admin" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Revenue & Reports</h2>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Generating reports…</p>
          ) : !report ? (
            <p style={{ color: "var(--text-muted)" }}>No report data available.</p>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="stats-grid" style={{ marginBottom: "2rem" }}>
                <div className="stat-card accent">
                  <div className="stat-icon"><DollarSign size={22} /></div>
                  <div className="stat-value">{fmt(report.totalRevenue)}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
                <div className="stat-card primary">
                  <div className="stat-icon"><BookOpen size={22} /></div>
                  <div className="stat-value">{report.totalBookings}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-card success">
                  <div className="stat-icon"><CheckCircle size={22} /></div>
                  <div className="stat-value">{report.confirmedBookings}</div>
                  <div className="stat-label">Confirmed</div>
                </div>
                <div className="stat-card info">
                  <div className="stat-icon"><TrendingUp size={22} /></div>
                  <div className="stat-value">{report.completedBookings}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card danger">
                  <div className="stat-icon"><XCircle size={22} /></div>
                  <div className="stat-value">{report.cancelledBookings}</div>
                  <div className="stat-label">Cancelled</div>
                </div>
              </div>

              {/* Highlights */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <Star size={16} style={{ marginRight: 6, verticalAlign: "middle", color: "var(--accent)" }} />
                      Most Booked Hotel
                    </span>
                  </div>
                  <div className="card-body">
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary-light)" }}>
                      {report.mostBookedHotel || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <BarChart3 size={16} style={{ marginRight: 6, verticalAlign: "middle", color: "var(--info)" }} />
                      Most Popular Room Type
                    </span>
                  </div>
                  <div className="card-body">
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary-light)" }}>
                      {report.mostPopularRoomType || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Status Breakdown */}
              {report.bookingsByStatus && (
                <div className="table-container" style={{ marginBottom: "2rem" }}>
                  <div className="table-header">
                    <span className="table-title">Booking Status Breakdown</span>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr><th>Status</th><th>Count</th><th>% of Total</th></tr>
                    </thead>
                    <tbody>
                      {Object.entries(report.bookingsByStatus).map(([status, count]) => {
                        const pct = report.totalBookings
                          ? ((count / report.totalBookings) * 100).toFixed(1)
                          : 0;
                        const cls = { PENDING: "badge-pending", CONFIRMED: "badge-confirmed", CANCELLED: "badge-cancelled", COMPLETED: "badge-completed" }[status] || "badge-pending";
                        return (
                          <tr key={status}>
                            <td><span className={`badge ${cls}`}>{status}</span></td>
                            <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{count}</td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ flex: 1, height: 6, background: "var(--bg-elevated)", borderRadius: 3 }}>
                                  <div style={{ width: `${pct}%`, height: "100%", background: "var(--grad-primary)", borderRadius: 3 }} />
                                </div>
                                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", minWidth: 40 }}>{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Hotel Performance */}
              {report.hotelPerformance && report.hotelPerformance.length > 0 && (
                <div className="table-container">
                  <div className="table-header">
                    <span className="table-title">Hotel Performance</span>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Hotel</th>
                        <th>City</th>
                        <th>Bookings</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.hotelPerformance
                        .sort((a, b) => b.totalBookings - a.totalBookings)
                        .map((h) => (
                          <tr key={h.hotelId}>
                            <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{h.hotelName}</td>
                            <td style={{ color: "var(--text-muted)" }}>{h.city}</td>
                            <td>
                              <span className="badge badge-confirmed">{h.totalBookings}</span>
                            </td>
                            <td style={{ fontWeight: 600, color: "var(--success)" }}>
                              {fmt(h.revenue)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReports;