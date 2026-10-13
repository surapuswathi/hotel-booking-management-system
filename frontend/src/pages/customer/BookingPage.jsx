import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hotelService, roomService, bookingService } from "../../services/services";
import Navbar from "../../components/Navbar";

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  const todayString = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        setError("");
        if (!roomId) { setError("Room ID is missing. Please select a room again."); return; }
        const response = await roomService.getById(roomId);
        const roomData = response.data?.data ?? response.data?.room ?? response.data;
        if (!roomData || !roomData.id) throw new Error("Room details could not be found.");
        setRoom(roomData);
        const capacity = Number(roomData.capacity ?? 1);
        setGuests(1); // Default to 1 guest; max is enforced by the input's max={capacity}
        const hotelId = roomData.hotel?.id ?? roomData.hotelId;
        if (hotelId) {
          try {
            const hotelResponse = await hotelService.getById(hotelId);
            setHotel(hotelResponse.data?.data ?? hotelResponse.data?.hotel ?? hotelResponse.data);
          } catch { /* non-critical */ }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Unable to load room details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const validateBooking = () => {
    if (!room) return "Room details are unavailable.";
    if (!checkInDate || !checkOutDate) return "Please select both check-in and check-out dates.";
    if (checkInDate < todayString) return "Check-in date cannot be in the past.";
    if (checkOutDate <= checkInDate) return "Check-out date must be after check-in date.";
    const capacity = Number(room.capacity ?? 1);
    const guestCount = Number(guests);
    if (!Number.isInteger(guestCount) || guestCount < 1) return "Please enter a valid number of guests.";
    if (guestCount > capacity) return `This room accommodates a maximum of ${capacity} guest(s).`;
    return "";
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const validationError = validateBooking();
    if (validationError) { setError(validationError); return; }
    try {
      setBookingLoading(true);
      setError("");
      // hotelId is required by the backend BookingRequest DTO
      const hotelId = room?.hotel?.id ?? room?.hotelId;
      if (!hotelId) throw new Error("Could not determine hotel ID for this room.");
      const response = await bookingService.create({
        roomId: Number(roomId),
        hotelId: Number(hotelId),
        checkInDate,
        checkOutDate,
        numberOfRooms: 1,
        numberOfGuests: Number(guests),
      });
      const booking = response.data?.data ?? response.data?.booking ?? response.data;
      if (!booking?.id) throw new Error("Booking was submitted, but the booking ID was not returned.");
      navigate(`/customer/payment/${booking.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Unable to create booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const capacity = Number(room?.capacity ?? 1);
  const price = Number(room?.price ?? room?.pricePerNight ?? room?.roomType?.pricePerNight ?? 0);
  const nights = checkInDate && checkOutDate && checkOutDate > checkInDate
    ? Math.round((new Date(`${checkOutDate}T00:00:00`).getTime() - new Date(`${checkInDate}T00:00:00`).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const totalAmount = price * nights;

  const fmt = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", color: "var(--text-muted)" }}>
          <div style={{ width: 48, height: 48, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p>Loading room details…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "calc(100vh - 72px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <div style={{ fontSize: "3rem" }}>😕</div>
          <h2 style={{ fontWeight: 700 }}>{error || "Room not found"}</h2>
          <button className="btn btn-primary" onClick={() => navigate("/hotels")}>Browse Hotels</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%)", borderBottom: "1px solid var(--border)", padding: "2.5rem 0 1.75rem" }}>
        <div className="container">
          <button onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "1rem", transition: "var(--transition)" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--primary-light)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >← Go Back</button>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>
            Book Your{" "}
            <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Room</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Select your dates and confirm your stay</p>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        <div className="booking-grid-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start" }}>

          {/* Left: Booking form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {error && <div className="alert alert-error">⚠ {error}</div>}

            {/* Date & Guest form */}
            <form onSubmit={handleBooking}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "1.25rem" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>📅</span>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Select Your Dates</h2>
                </div>
                <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="checkInDate">Check-in Date</label>
                    <input id="checkInDate" type="date" className="form-control" min={todayString} value={checkInDate}
                      onChange={e => { setCheckInDate(e.target.value); setError(""); }} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="checkOutDate">Check-out Date</label>
                    <input id="checkOutDate" type="date" className="form-control" min={checkInDate || todayString} value={checkOutDate}
                      onChange={e => { setCheckOutDate(e.target.value); setError(""); }} required />
                  </div>
                </div>
                <div style={{ padding: "0 1.25rem 1.25rem" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="guests">Number of Guests</label>
                    <input id="guests" type="number" className="form-control" min="1" max={capacity} step="1" value={guests}
                      onChange={e => { const v = Number(e.target.value); if (v >= 1 && v <= capacity) setGuests(v); setError(""); }} required />
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                      🛏 This room accommodates up to {capacity} guest{capacity !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration visual */}
              {nights > 0 && (
                <div style={{ background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: "var(--radius-md)", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "1.3rem" }}>🌙</span>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--primary-light)", fontSize: "0.9rem" }}>
                      {nights} night{nights !== 1 ? "s" : ""} selected
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {new Date(checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {" → "}
                      {new Date(checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={bookingLoading || !room} id="booking-submit-btn">
                {bookingLoading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                    <span style={{ width: 20, height: 20, border: "3px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    Creating Booking…
                  </span>
                ) : "Continue to Payment →"}
              </button>
            </form>
          </div>

          {/* Right: Room summary */}
          <div style={{ position: "sticky", top: "88px" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              <div style={{ height: 4, background: "var(--grad-primary)" }} />

              {/* Room image */}
              {room.imageUrl ? (
                <img src={room.imageUrl} alt={room.roomType?.name || "Room"} style={{ width: "100%", height: 180, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
              ) : (
                <div style={{ height: 160, background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "var(--text-muted)" }}>🛏</div>
              )}

              <div style={{ padding: "1.25rem" }}>
                {/* Hotel & Room info */}
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
                  {hotel?.city || ""}{hotel?.state ? `, ${hotel.state}` : ""}
                </p>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.2rem" }}>
                  {hotel?.name || room.hotel?.name || "Selected Hotel"}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--primary-light)", fontWeight: 600, marginBottom: "1rem" }}>
                  {room.roomType?.name || "Hotel Room"} · Room {room.roomNumber}
                </p>

                {/* Room features */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                  {room.roomType?.bedType && (
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      🛏 {room.roomType.bedType}
                    </span>
                  )}
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    👥 Up to {capacity} guests
                  </span>
                </div>

                {/* Price breakdown */}
                <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "0.9rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Rate per night</span>
                    <span style={{ fontWeight: 700 }}>{fmt(price)}</span>
                  </div>
                  {nights > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      <span style={{ color: "var(--text-muted)" }}>× {nights} night{nights !== 1 ? "s" : ""}</span>
                      <span style={{ fontWeight: 600 }}>{fmt(price)} × {nights}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid var(--border)", marginTop: "0.5rem" }}>
                    <span style={{ fontWeight: 700 }}>Estimated Total</span>
                    <span style={{ fontWeight: 800, fontSize: "1.15rem", background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {nights > 0 ? fmt(totalAmount) : "—"}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                    * Final amount confirmed at checkout
                  </p>
                </div>

                {/* Amenities */}
                {room.roomType?.amenities && (
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                      Amenities
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {room.roomType.amenities}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default BookingPage;