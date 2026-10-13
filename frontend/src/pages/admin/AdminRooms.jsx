import { useEffect, useState } from "react";
import { adminService, hotelService, roomTypeService } from "../../services/services";
import Sidebar from "../../components/Sidebar";
import { Plus, Pencil, Trash2, BedDouble, X, Check } from "lucide-react";

const EMPTY_FORM = {
  roomNumber: "", hotelId: "", roomTypeId: "",
  price: "", capacity: 2, description: "", imageUrl: "", status: "AVAILABLE",
};

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterHotelId, setFilterHotelId] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [hotelsRes, roomTypesRes] = await Promise.all([
        adminService.getAllHotels(),
        roomTypeService.getAll(),
      ]);
      const hotelList = hotelsRes.data.data || [];
      const rtList = roomTypesRes.data.data || [];
      setHotels(hotelList);
      setRoomTypes(rtList);

      // Load rooms for a hotel if one is selected, else load from all hotels
      if (filterHotelId && hotelList.length > 0) {
        const roomsRes = await hotelService.getRooms(filterHotelId);
        setRooms(roomsRes.data.data || []);
      } else if (hotelList.length > 0) {
        // Load rooms from first hotel as default
        const roomsRes = await hotelService.getRooms(hotelList[0].id);
        setRooms(roomsRes.data.data || []);
        setFilterHotelId(String(hotelList[0].id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const loadRooms = async (hotelId) => {
    if (!hotelId) return;
    try {
      const res = await hotelService.getRooms(hotelId);
      setRooms(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHotelFilter = (id) => {
    setFilterHotelId(id);
    loadRooms(id);
  };

  const openCreate = () => {
    setEditingRoom(null);
    setForm({ ...EMPTY_FORM, hotelId: filterHotelId });
    setError("");
    setShowModal(true);
  };

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({
      roomNumber: room.roomNumber || "",
      hotelId: String(room.hotel?.id || filterHotelId),
      roomTypeId: String(room.roomType?.id || ""),
      price: String(room.price || ""),
      capacity: room.capacity || 2,
      description: room.description || "",
      imageUrl: room.imageUrl || "",
      status: room.status || "AVAILABLE",
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
      if (editingRoom) {
        await adminService.updateRoom(editingRoom.id, payload);
      } else {
        await adminService.createRoom(payload);
      }
      setShowModal(false);
      loadRooms(filterHotelId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save room.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this room?")) return;
    try {
      await adminService.deleteRoom(id);
      loadRooms(filterHotelId);
    } catch (err) {
      console.error(err);
    }
  };

  const statusBadgeClass = {
    AVAILABLE: "badge-confirmed",
    OCCUPIED: "badge-pending",
    MAINTENANCE: "badge-cancelled",
  };

  return (
    <div className="dashboard-layout">
      <Sidebar type="admin" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Manage Rooms</h2>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <select
              className="form-control"
              style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem", width: "auto" }}
              value={filterHotelId}
              onChange={(e) => handleHotelFilter(e.target.value)}
            >
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <Plus size={16} /> Add Room
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading rooms…</p>
          ) : rooms.length === 0 ? (
            <div className="table-container" style={{ padding: "3rem", textAlign: "center" }}>
              <BedDouble size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
              <p style={{ color: "var(--text-muted)" }}>No rooms found for this hotel.</p>
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
                        <span className={`badge ${statusBadgeClass[r.status] || "badge-pending"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)} title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)} title="Delete">
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
              borderRadius: "var(--radius-xl)", padding: "2rem", width: "100%", maxWidth: 560,
              maxHeight: "90vh", overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {editingRoom ? "Edit Room" : "Add New Room"}
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
                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} placeholder="e.g. 101" />
                </div>
                <div className="form-group">
                  <label className="form-label">Hotel *</label>
                  <select className="form-control" required value={form.hotelId}
                    onChange={(e) => setForm({ ...form, hotelId: e.target.value })}>
                    <option value="">Select Hotel</option>
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
                  <input className="form-control" type="number" required min="0" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 2500" />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity *</label>
                  <input className="form-control" type="number" required min="1" max="20" value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
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
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : <><Check size={16} /> {editingRoom ? "Update" : "Create"} Room</>}
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

export default AdminRooms;