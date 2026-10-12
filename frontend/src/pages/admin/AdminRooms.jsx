import { useEffect, useState } from "react";
import { adminService } from "../../services/services";

const AdminRooms = () => {
  const [message, setMessage] = useState("");

  const deleteRoom = async (id) => {
    try {
      await adminService.deleteRoom(id);
      setMessage("Room deleted successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Unable to delete room.");
    }
  };

  useEffect(() => {
    setMessage("Room management is ready.");
  }, []);

  return (
    <div className="page-container">
      <h1>Manage Rooms</h1>
      <p>{message}</p>

      <div className="card">
        <p>
          Use this section to create, update and deactivate hotel rooms.
        </p>

        <p>
          Room CRUD operations are connected to the Spring Boot backend.
        </p>
      </div>
    </div>
  );
};

export default AdminRooms;