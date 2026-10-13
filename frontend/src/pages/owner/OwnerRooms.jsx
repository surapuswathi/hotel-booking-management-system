import { useEffect, useState } from "react";
import { ownerService, roomTypeService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { Plus, Pencil, Trash2, BedDouble, X, Check } from "lucide-react";

const EMPTY_FORM = {
  roomNumber: "", hotelId: "", roomTypeId: "",
  price: "", capacity: 2, description: "", imageUrl: "", status: "AVAILABLE",
};

const STATUS_BADGE = {
  AVAILABLE: "badge-confirmed",
  OCCUPIED: "badge-pending",
  MAINTENANCE: "badge-cancelled",
};

const OwnerRooms = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadInit = async () => {
    setLoading(true);
    try {
      const [hotelsRes, rtRes] = await Promise.all([
        ownerService.getHotels(),
        roomTypeService.getAll(),
      ]);
      const hotelList = hotelsRes.data.data || [];
      setHotels(hotelList);
      setRoomTypes(rtRes.data.data || []);

      if (hotelList.length > 0) {
        const firstId = String(hotelList[0].id);
        setSelectedHotel(firstId);
        await loadRooms(firstId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async (hotelId) => {
    if (!hotelId) return;
    try {
      // Fetch rooms via owner bookings filtered or hotel rooms endpoint
      const { hotelService } = await import("../../services/services");
      const res = await hotelService.getRooms(hotelId);
      setRooms(res.data.data || []);
    } catch (err) {
      console.error(err);
      setRooms([]);
    }
  };

  useEffect(() => { loadInit(); }, []);

  const handleHotelChange = (id) => {
    setSelectedHotel(id);
    loadRooms(id);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, hotelId: selectedHotel });
    setError("");
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      roomNumber: r.roomNumber || "",
      hotelId: String(r.hotel?.id || selectedHotel),
      roomTypeId: String(r.roomType?.id || ""),
      price: String(r.price || ""),
      capacity: r.capacity || 2,
      description: r.description || "",
      imageUrl: r.imageUrl || "",
      status: r.status || "AVAILABLE",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        hotelId: Number(form.hotelId),
        roomTypeId: Number(form.roomTypeId),
        price: parseFloat(form.price),
        capacity: Number(form.capacity),
      };
      if (editing) {
        await ownerService.updateRoom(editing.id, payload);
      } else {
        await ownerService.createRoom(payload);
      }
      setShowModal(false);
      loadRooms(selectedHotel);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save room.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this room?")) return;
    try {
      await ownerService.deleteRoom(id);
      setMessage("Room deactivated.");
      loadRooms(selectedHotel);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar type="owner" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>My Rooms</h2>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {hotels.length > 0 && (
              <select
                className="form-control"
                style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem", width: "auto" }}
                value={selectedHotel}
                onChange={(e) => handleHotelChange(e.target.value)}
              >
                {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            )}
            <button className="btn btn-primary btn-sm" onClick={openCreate} disabled={hotels.length === 0}>
              <Plus size={16} /> Add Room
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {message && (
            <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.3)", borderRadius: "var(--radius-md)", color: "var(--success)" }}>
              {message}
            </div>
          )}

          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading rooms…</p>
          ) : hotels.length === 0 ? (
            <div className="table-container" style={{ padding: "4rem", textAlign: "center" }}>
              <BedDouble size={60} style={{ color: "var(--text-muted)", opacity: 0.4, marginBottom: "1rem" }} />
              <h3 style={{ marginBottom: "0.5rem" }}>No hotels yet</h3>
              <p style={{ color: "var(--text-muted)" }}>Create a hotel first, then add rooms.</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="table-container" style={{ padding: "4rem", textAlign: "center" }}>
              <BedDouble size={60} style={{ color: "var(--text-muted)", opacity: 0.4, marginBottom: "1rem" }} />
              <h3 style={{ marginBottom: "0.5rem" }}>No rooms yet</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Add rooms to this hotel.</p>
              <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Room</button>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <span className="table-title">Rooms ({rooms.length})</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room #</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Price/Night</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{r.roomNumber}</td>
                      <td>{r.roomType?.name || "—"}</td>
                      <td>{r.capacity} guests</td>
                      <td style={{ color: "var(--primary-light)", fontWeight: 600 }}>
                        ₹{Number(r.price).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[r.status] || "badge-pending"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>
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
              borderRadius: "var(--radius-xl)", padding: "2rem", width: "100%", maxWidth: 540,
              maxHeight: "90vh", overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {editing ? "Edit Room" : "Add New Room"}
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
                <div className="form-group">
                  <label className="form-label">Room Number *</label>
                  <input className="form-control" required value={form.roomNumber}
                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hotel *</label>
                  <select className="form-control" required value={form.hotelId}
                    onChange={(e) => setForm({ ...form, hotelId: e.target.value })}>
                    {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Room Type *</label>
                  <select className="form-control" required value={form.roomTypeId}
                    onChange={(e) => setForm({ ...form, roomTypeId: e.target.value })}>
                    <option value="">Select Type</option>
                    {roomTypes.map((rt) => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price/Night (₹) *</label>
                  <input className="form-control" type="number" required min="0"
                    value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity *</label>
                  <input className="form-control" type="number" required min="1" max="20"
                    value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-control" type="url" value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={2} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : <><Check size={16} /> {editing ? "Update" : "Create"} Room</>}
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

export default OwnerRooms;
