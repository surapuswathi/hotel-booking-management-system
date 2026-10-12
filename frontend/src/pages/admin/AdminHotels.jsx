import { useEffect, useState } from "react";
import { adminService } from "../../services/services";

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);

  const loadHotels = async () => {
    try {
      const res = await adminService.getAllHotels();
      setHotels(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const deleteHotel = async (id) => {
    if (!window.confirm("Delete this hotel?")) return;

    try {
      await adminService.deleteHotel(id);
      loadHotels();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1>Manage Hotels</h1>

      {hotels.map((hotel) => (
        <div className="card" key={hotel.id}>
          <h2>{hotel.name}</h2>
          <p>{hotel.city}</p>
          <p>{hotel.description}</p>

          <button onClick={() => deleteHotel(hotel.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminHotels;