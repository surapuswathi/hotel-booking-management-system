import { useEffect, useState } from "react";
import { adminService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { Users, UserCheck, UserX } from "lucide-react";

const ROLE_COLORS = {
  ADMIN: "badge-cancelled",
  HOTEL_OWNER: "badge-pending",
  CUSTOMER: "badge-confirmed",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("ALL");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleStatus = async (user) => {
    try {
      await adminService.toggleUserStatus(user.id, !user.active);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered =
    roleFilter === "ALL" ? users : users.filter((u) => u.role === roleFilter);

  return (
    <div className="dashboard-layout">
      <Sidebar type="admin" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Manage Users</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["ALL", "CUSTOMER", "HOTEL_OWNER", "ADMIN"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`btn btn-sm ${roleFilter === r ? "btn-primary" : "btn-secondary"}`}
              >
                {r === "ALL" ? "All" : r.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-content">
          {/* Quick stats */}
          <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
            {[
              { label: "Total Users", value: users.length, color: "primary", icon: Users },
              { label: "Customers", value: users.filter((u) => u.role === "CUSTOMER").length, color: "success", icon: UserCheck },
              { label: "Hotel Owners", value: users.filter((u) => u.role === "HOTEL_OWNER").length, color: "warning", icon: UserCheck },
              { label: "Inactive", value: users.filter((u) => !u.active).length, color: "danger", icon: UserX },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className={`stat-card ${color}`}>
                <div className="stat-icon"><Icon size={20} /></div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading users…</p>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <span className="table-title">Users ({filtered.length})</span>
              </div>
              {filtered.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center" }}>
                  <p style={{ color: "var(--text-muted)" }}>No users found.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div className="user-avatar" style={{ width: 36, height: 36, fontSize: "0.9rem" }}>
                              {u.fullName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{u.fullName}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: "0.875rem" }}>{u.email}</td>
                        <td style={{ fontSize: "0.875rem" }}>{u.phone || "—"}</td>
                        <td>
                          <span className={`badge ${ROLE_COLORS[u.role] || "badge-pending"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.active ? "badge-confirmed" : "badge-cancelled"}`}>
                            {u.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${u.active ? "btn-danger" : "btn-success"}`}
                            onClick={() => toggleStatus(u)}
                          >
                            {u.active ? (
                              <><UserX size={13} /> Deactivate</>
                            ) : (
                              <><UserCheck size={13} /> Activate</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;