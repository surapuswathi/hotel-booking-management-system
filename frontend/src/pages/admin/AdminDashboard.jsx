import { useEffect, useState } from "react";
import { adminService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { Hotel, BedDouble, BookOpen, Users, DollarSign, TrendingUp, XCircle, CheckCircle, Activity } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color, subtitle }) => (
  <div className={`stat-card ${color}`}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div className={`stat-icon`}><Icon size={20} /></div>
    </div>
    <div className="stat-value" style={{ marginTop: "0.5rem" }}>{value ?? "—"}</div>
    <div className="stat-label">{label}</div>
    {subtitle && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{subtitle}</div>}
  </div>
);

// Mini bar chart
const MiniBar = ({ data, max }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
    {data.map((v, i) => (
      <div key={i} style={{ flex: 1, background: i === data.length - 1 ? "var(--primary)" : "var(--bg-elevated)", borderRadius: 3, height: `${Math.max(6, (v / max) * 100)}%`, transition: "height 0.5s ease", minHeight: 4 }} />
    ))}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setStats(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  const monthlyValues = stats?.monthlyBookings ? Object.values(stats.monthlyBookings) : [];
  const maxMonthly = Math.max(...monthlyValues, 1);

  const revenueValues = stats?.monthlyRevenue ? Object.values(stats.monthlyRevenue) : [];
  const maxRevenue = Math.max(...revenueValues, 1);

  return (
    <div className="dashboard-layout">
      <Sidebar type="admin" />
      <main className="dashboard-main">
        {/* Top bar */}
        <div className="dashboard-topbar">
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Admin Dashboard</h2>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.85rem", background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.25)", borderRadius: "var(--radius-full)", fontSize: "0.78rem", fontWeight: 600, color: "var(--success)" }}>
            <Activity size={13} /> Live
          </div>
        </div>

        <div className="dashboard-content">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Overview</h1>
          </div>

          {loading ? (
            <div className="stats-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} style={{ height: 130, background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s infinite" }} />
              ))}
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
            </div>
          ) : (
            <>
              <div className="stats-grid">
                <StatCard label="Total Hotels" value={stats?.totalHotels} icon={Hotel} color="primary" />
                <StatCard label="Total Rooms" value={stats?.totalRooms} icon={BedDouble} color="info" />
                <StatCard label="Available" value={stats?.availableRooms} icon={BedDouble} color="success"
                  subtitle={stats?.totalRooms ? `${Math.round((stats.availableRooms / stats.totalRooms) * 100)}% free` : null} />
                <StatCard label="Total Bookings" value={stats?.totalBookings} icon={BookOpen} color="warning" />
                <StatCard label="Confirmed" value={stats?.confirmedBookings} icon={CheckCircle} color="success" />
                <StatCard label="Cancelled" value={stats?.cancelledBookings} icon={XCircle} color="danger" />
                <StatCard label="Revenue" value={fmt(stats?.totalRevenue)} icon={DollarSign} color="accent" />
                <StatCard label="Customers" value={stats?.registeredCustomers} icon={Users} color="secondary" />
              </div>

              {/* Charts section */}
              {monthlyValues.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "2rem" }}>
                  {/* Monthly bookings bar */}
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>📊 Monthly Bookings</h3>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Last {monthlyValues.length} months</span>
                    </div>
                    <MiniBar data={monthlyValues} max={maxMonthly} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      {Object.keys(stats.monthlyBookings).slice(-5).map(m => (
                        <span key={m}>{m.slice(0, 3)}</span>
                      ))}
                    </div>
                  </div>

                  {/* Monthly revenue bar */}
                  {revenueValues.length > 0 && (
                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>💰 Monthly Revenue</h3>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>INR</span>
                      </div>
                      <MiniBar data={revenueValues} max={maxRevenue} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {Object.keys(stats.monthlyRevenue).slice(-5).map(m => (
                          <span key={m}>{m.slice(0, 3)}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Monthly table */}
              {stats?.monthlyBookings && Object.keys(stats.monthlyBookings).length > 0 && (
                <div className="table-container" style={{ marginTop: "1.5rem" }}>
                  <div className="table-header">
                    <span className="table-title">
                      <TrendingUp size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                      Monthly Breakdown
                    </span>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Bookings</th>
                        <th>Revenue</th>
                        <th>Avg. Booking</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stats.monthlyBookings).map(([month, count]) => {
                        const rev = stats.monthlyRevenue?.[month] || 0;
                        const avg = count > 0 ? rev / count : 0;
                        return (
                          <tr key={month}>
                            <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{month}</td>
                            <td><span className="badge badge-confirmed">{count}</span></td>
                            <td style={{ color: "var(--success)", fontWeight: 600 }}>{fmt(rev)}</td>
                            <td style={{ color: "var(--text-secondary)" }}>{fmt(avg)}</td>
                          </tr>
                        );
                      })}
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

export default AdminDashboard;