import { useState } from "react";
import { ownerService } from "../../services/services";

const OwnerRooms = () => {
  const [message, setMessage] = useState("");

  const deleteRoom = async (id) => {
    try {
      await ownerService.deleteRoom(id);
      setMessage("Room deleted successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Unable to delete room.");
    }
  };

  return (
    <div className="page-container">
      <h1>My Rooms</h1>

      <div className="card">
        <p>Manage rooms belonging to your hotels.</p>

        {message && <p>{message}</p>}

        <button onClick={() => deleteRoom(0)}>
          Delete Room
        </button>
      </div>
    </div>
  );
};

export default OwnerRooms;
