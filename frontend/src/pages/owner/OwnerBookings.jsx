import { useEffect, useState } from "react";
import { ownerService } from "../../services/services";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    ownerService
      .getBookings()
      .then((res) => setBookings(res.data.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <h1>Hotel Bookings</h1>

      {bookings.map((booking) => (
        <div className="card" key={booking.id}>
          <h3>Booking #{booking.id}</h3>

          <p>Status: {booking.status}</p>
          <p>Check-in: {booking.checkInDate}</p>
          <p>Check-out: {booking.checkOutDate}</p>
          <p>Total: ₹{booking.totalAmount}</p>
        </div>
      ))}
    </div>
  );
};

export default OwnerBookings;