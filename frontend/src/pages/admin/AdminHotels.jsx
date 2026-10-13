import { useEffect, useState } from "react";
import { adminService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { Plus, Pencil, Trash2, Hotel, X, Check } from "lucide-react";

const EMPTY_FORM = {
  name: "", city: "", state: "", country: "", address: "",
  phone: "", email: "", description: "", imageUrl: "", rating: 4.0,
};

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadHotels = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllHotels();
      setHotels(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHotels(); }, []);

  const openCreate = () => {
    setEditingHotel(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEdit = (hotel) => {
    setEditingHotel(hotel);
    setForm({
      name: hotel.name || "",
      city: hotel.city || "",
      state: hotel.state || "",
      country: hotel.country || "",
      address: hotel.address || "",
      phone: hotel.phone || "",
      email: hotel.email || "",
      description: hotel.description || "",
      imageUrl: hotel.imageUrl || "",
      rating: hotel.rating || 4.0,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingHotel) {
        await adminService.updateHotel(editingHotel.id, form);
      } else {
        await adminService.createHotel(form);
      }
      setShowModal(false);
      loadHotels();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save hotel.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete / deactivate this hotel?")) return;
    try {
      await adminService.deleteHotel(id);
      loadHotels();
    } catch (err) {
      console.error(err);
    }
  };

  const field = (label, key, type = "text", opts = {}) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === "textarea" ? (
        <textarea
          className="form-control"
          rows={3}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          {...opts}
        />
      ) : (
        <input
          className="form-control"
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          {...opts}
        />
      )}
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar type="admin" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Manage Hotels</h2>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Plus size={16} /> Add Hotel
          </button>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading hotels…</p>
          ) : hotels.length === 0 ? (
            <div className="table-container" style={{ padding: "3rem", textAlign: "center" }}>
              <Hotel size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
              <p style={{ color: "var(--text-muted)" }}>No hotels found. Add your first hotel.</p>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <span className="table-title">All Hotels ({hotels.length})</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Location</th>
                    <th>Rating</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((h) => (
                    <tr key={h.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{h.name}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {h.description?.slice(0, 50)}...
                        </div>
                      </td>
                      <td>
                        {h.city}, {h.state}
                        <br />
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{h.country}</span>
                      </td>
                      <td>
                        <span className="badge badge-confirmed">⭐ {h.rating}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.82rem" }}>{h.phone}</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{h.email}</div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEdit(h)}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(h.id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
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

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)", zIndex: 9000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "var(--bg-card)", border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-xl)", padding: "2rem", width: "100%", maxWidth: 600,
              maxHeight: "90vh", overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {editingHotel ? "Edit Hotel" : "Add New Hotel"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={22} />
              </button>
            </div>

            {error && (
              <div className="form-error" style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(239,71,111,0.1)", borderRadius: "var(--radius-md)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                {field("Hotel Name *", "name", "text", { required: true, placeholder: "e.g. The Grand Palace" })}
                {field("City *", "city", "text", { required: true, placeholder: "e.g. Mumbai" })}
                {field("State", "state", "text", { placeholder: "e.g. Maharashtra" })}
                {field("Country", "country", "text", { placeholder: "e.g. India" })}
                {field("Phone", "phone", "text", { placeholder: "+91-9876543210" })}
                {field("Email", "email", "email", { placeholder: "hotel@example.com" })}
              </div>
              {field("Address", "address", "text", { placeholder: "Full street address" })}
              {field("Image URL", "imageUrl", "url", { placeholder: "https://..." })}
              {field("Description", "description", "textarea")}

              <div className="form-group">
                <label className="form-label">Rating (0–5)</label>
                <input
                  className="form-control"
                  type="number" min="0" max="5" step="0.1"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : <><Check size={16} /> {editingHotel ? "Update Hotel" : "Create Hotel"}</>}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHotels;