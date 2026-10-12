import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hotelService } from "../services/services";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);

        const hotelResponse = await hotelService.getById(id);
        setHotel(hotelResponse.data.data);

        const roomsResponse = await hotelService.getRooms(id);
        setRooms(roomsResponse.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading hotel...</div>;
  }

  if (error) {
    return <div style={{ padding: "40px" }}>{error}</div>;
  }

  if (!hotel) {
    return <div style={{ padding: "40px" }}>Hotel not found.</div>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "auto" }}>
      <button onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div style={{ marginTop: "20px" }}>
        {hotel.imageUrl && (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        )}

        <h1>{hotel.name}</h1>

        <p>
          <strong>Location:</strong> {hotel.city}, {hotel.state},{" "}
          {hotel.country}
        </p>

        <p>
          <strong>Address:</strong> {hotel.address}
        </p>

        <p>{hotel.description}</p>

        <p>
          <strong>Rating:</strong> ⭐ {hotel.rating}
        </p>

        <h2>Available Rooms</h2>

        {rooms.length === 0 ? (
          <p>No rooms available.</p>
        ) : (
          <div>
            {rooms.map((room) => (
              <div
                key={room.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "20px",
                  marginBottom: "15px",
                  borderRadius: "10px",
                }}
              >
                <h3>
                  {room.roomType?.name || `Room ${room.roomNumber}`}
                </h3>

                <p>Room Number: {room.roomNumber}</p>

                <p>
                  Price: ₹{room.pricePerNight || room.price || 0} / night
                </p>

                <button
                  onClick={() =>
                    navigate(`/booking/${room.id}?hotelId=${hotel.id}`)
               }
                >
                  Book This Room
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;