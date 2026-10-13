import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/services";
import Navbar from "../../components/Navbar";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [fullName, setFullName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [submitting, setSubmitting] = useState(false);

  // Change password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwMessageType, setPwMessageType] = useState("");
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    try {
      setSubmitting(true);
      const response = await userService.updateProfile({ fullName, phone });
      const updatedUser = response.data.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Unable to update profile.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMessage("");
    setPwMessageType("");
    if (newPassword !== confirmPassword) {
      setPwMessage("New passwords do not match.");
      setPwMessageType("error");
      return;
    }
    if (newPassword.length < 6) {
      setPwMessage("Password must be at least 6 characters.");
      setPwMessageType("error");
      return;
    }
    try {
      setPwSubmitting(true);
      await userService.changePassword({ currentPassword, newPassword });
      setPwMessage("Password changed successfully!");
      setPwMessageType("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setPwMessage(err.response?.data?.message || "Failed to change password.");
      setPwMessageType("error");
    } finally {
      setPwSubmitting(false);
    }
  };

  const initials = (user.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleColors = {
    ADMIN: "var(--danger)",
    HOTEL_OWNER: "var(--warning)",
    CUSTOMER: "var(--success)",
  };
  const roleColor = roleColors[user.role] || "var(--primary-light)";

  return (
    <>
      <Navbar />

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "3rem 0 2rem",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            {/* Avatar */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "var(--grad-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "white",
                flexShrink: 0,
                boxShadow: "var(--shadow-primary)",
              }}
            >
              {initials}
            </div>
            <div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                {user.fullName || "My Profile"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: roleColor,
                    background: `${roleColor}18`,
                    border: `1px solid ${roleColor}40`,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  {(user.role || "CUSTOMER").replace("_", " ")}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            maxWidth: 900,
          }}
        >
          {/* Left: Profile info */}
          <div>
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
                <span style={{ fontSize: "1.1rem" }}>👤</span>
                <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>
                  Personal Information
                </h2>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
                {message && (
                  <div
                    className={`alert ${
                      messageType === "success" ? "alert-success" : "alert-error"
                    }`}
                  >
                    {messageType === "success" ? "✓" : "⚠"} {message}
                  </div>
                )}

                {/* Full name */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email (readonly) */}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="form-control"
                      value={user.email || ""}
                      disabled
                      style={{ paddingRight: "3rem", opacity: 0.6 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        background: "var(--bg-elevated)",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      Locked
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    type="tel"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={submitting}
                >
                  {submitting ? "Saving…" : "💾 Save Changes"}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Quick links + Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Account overview */}
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
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>
                  🧭 Quick Navigation
                </h2>
                {[
                  { icon: "📋", label: "My Bookings", sub: "View all reservations", path: "/customer/bookings" },
                  { icon: "🏨", label: "Browse Hotels", sub: "Find your next stay", path: "/hotels" },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      width: "100%",
                      padding: "0.85rem 1rem",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      transition: "var(--transition)",
                      marginBottom: "0.6rem",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.background = "rgba(108,99,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.background = "var(--bg-elevated)";
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.1rem" }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {item.sub}
                      </p>
                    </div>
                    <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: "1rem" }}>→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Change password */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setShowPasswordSection((p) => !p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "1rem 1.25rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  borderBottom: showPasswordSection ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>🔐</span>
                  <span style={{ fontSize: "1rem", fontWeight: 700 }}>Change Password</span>
                </div>
                <span
                  style={{
                    transition: "transform 0.25s ease",
                    transform: showPasswordSection ? "rotate(180deg)" : "none",
                    color: "var(--text-muted)",
                  }}
                >
                  ▼
                </span>
              </button>

              {showPasswordSection && (
                <form onSubmit={handlePasswordChange} style={{ padding: "1.25rem" }}>
                  {pwMessage && (
                    <div
                      className={`alert ${
                        pwMessageType === "success" ? "alert-success" : "alert-error"
                      }`}
                    >
                      {pwMessageType === "success" ? "✓" : "⚠"} {pwMessage}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-secondary btn-full"
                    disabled={pwSubmitting}
                  >
                    {pwSubmitting ? "Updating…" : "🔑 Update Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default Profile;