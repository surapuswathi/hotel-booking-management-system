import { useEffect, useState } from "react";
import { roomTypeService } from "../../services/services";

const AdminRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    roomTypeService
      .getAll()
      .then((res) => setRoomTypes(res.data.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <h1>Room Types</h1>

      {roomTypes.map((type) => (
        <div className="card" key={type.id}>
          <h2>{type.name}</h2>
          <p>{type.description}</p>
          <p>Capacity: {type.capacity}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminRoomTypes;