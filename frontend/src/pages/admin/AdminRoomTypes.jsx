import { useEffect, useState } from "react";
import { adminService, roomTypeService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { Plus, Pencil, Trash2, Tag, X, Check } from "lucide-react";

const EMPTY_FORM = { name: "", description: "", capacity: 2, basePrice: "" };

const AdminRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await roomTypeService.getAll();
      setRoomTypes(res.data.data || []);
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

  const openEdit = (rt) => {
    setEditing(rt);
    setForm({
      name: rt.name || "",
      description: rt.description || "",
      capacity: rt.capacity || 2,
      basePrice: String(rt.basePrice || ""),
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, capacity: Number(form.capacity), basePrice: parseFloat(form.basePrice) };
      if (editing) {
        await adminService.updateRoomType(editing.id, payload);
      } else {
        await adminService.createRoomType(payload);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save room type.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room type?")) return;
    try {
      await adminService.deleteRoomType(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar type="admin" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Room Types</h2>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Plus size={16} /> Add Room Type
          </button>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading…</p>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <span className="table-title">Room Types ({roomTypes.length})</span>
              </div>
              {roomTypes.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center" }}>
                  <Tag size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                  <p style={{ color: "var(--text-muted)" }}>No room types found.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Capacity</th>
                      <th>Base Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomTypes.map((rt) => (
                      <tr key={rt.id}>
                        <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          <Tag size={14} style={{ marginRight: 6, verticalAlign: "middle", color: "var(--primary-light)" }} />
                          {rt.name}
                        </td>
                        <td style={{ maxWidth: 250 }}>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                            {rt.description?.slice(0, 60) || "—"}
                          </span>
                        </td>
                        <td>{rt.capacity} guests</td>
                        <td style={{ color: "var(--primary-light)", fontWeight: 600 }}>
                          ₹{Number(rt.basePrice).toLocaleString("en-IN")}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(rt)}>
                              <Pencil size={14} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rt.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
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
              borderRadius: "var(--radius-xl)", padding: "2rem", width: "100%", maxWidth: 480,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {editing ? "Edit Room Type" : "Add Room Type"}
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
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-control" required placeholder="e.g. Deluxe Suite"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3}
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                <div className="form-group">
                  <label className="form-label">Capacity *</label>
                  <input className="form-control" type="number" min="1" max="20" required
                    value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Base Price (₹) *</label>
                  <input className="form-control" type="number" min="0" step="0.01" required
                    placeholder="e.g. 3000" value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : <><Check size={16} /> {editing ? "Update" : "Create"}</>}
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

export default AdminRoomTypes;