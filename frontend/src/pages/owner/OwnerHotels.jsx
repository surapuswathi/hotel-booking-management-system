import { useEffect, useState } from "react";
import { ownerService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { Plus, Pencil, Hotel, X, Check } from "lucide-react";

const EMPTY_FORM = {
  name: "", city: "", state: "", country: "", address: "",
  phone: "", email: "", description: "", imageUrl: "", rating: 4.0,
};

const OwnerHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await ownerService.getHotels();
      setHotels(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEdit = (h) => {
    setEditing(h);
    setForm({
      name: h.name || "", city: h.city || "", state: h.state || "",
      country: h.country || "", address: h.address || "",
      phone: h.phone || "", email: h.email || "",
      description: h.description || "", imageUrl: h.imageUrl || "",
      rating: h.rating || 4.0,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await ownerService.updateHotel(editing.id, form);
      } else {
        await ownerService.createHotel(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save hotel.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar type="owner" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>My Hotels</h2>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Plus size={16} /> Add Hotel
          </button>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading hotels…</p>
          ) : hotels.length === 0 ? (
            <div className="table-container" style={{ padding: "4rem", textAlign: "center" }}>
              <Hotel size={60} style={{ color: "var(--text-muted)", marginBottom: "1rem", opacity: 0.4 }} />
              <h3 style={{ marginBottom: "0.5rem" }}>No hotels yet</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Add your first property to get started.
              </p>
              <button className="btn btn-primary" onClick={openCreate}>
                <Plus size={16} /> Add Hotel
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
              {hotels.map((h) => (
                <div key={h.id} className="card">
                  {h.imageUrl ? (
                    <img src={h.imageUrl} alt={h.name} className="hotel-card-img" />
                  ) : (
                    <div className="hotel-card-img-placeholder">🏨</div>
                  )}
                  <div className="card-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{h.name}</h3>
                      <span style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.875rem" }}>⭐ {h.rating}</span>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      📍 {h.city}, {h.state}, {h.country}
                    </p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                      {h.description?.slice(0, 100) || "No description."}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(h)}>
                        <Pencil size={14} /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                {editing ? "Edit Hotel" : "Add New Hotel"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            {error && (
              <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(239,71,111,0.1)", borderRadius: "var(--radius-md)", color: "var(--danger)", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                {[
                  ["Hotel Name *", "name", "text", { required: true }],
                  ["City *", "city", "text", { required: true }],
                  ["State", "state", "text", {}],
                  ["Country", "country", "text", {}],
                  ["Phone", "phone", "text", {}],
                  ["Email", "email", "email", {}],
                ].map(([label, key, type, opts]) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label}</label>
                    <input className="form-control" type={type} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...opts} />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-control" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-control" type="url" value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Rating (0–5)</label>
                <input className="form-control" type="number" min="0" max="5" step="0.1"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : <><Check size={16} /> {editing ? "Update" : "Create"} Hotel</>}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerHotels;