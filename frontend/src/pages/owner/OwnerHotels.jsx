import { useEffect, useState } from "react";
import { ownerService } from "../../services/services";

const OwnerHotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    ownerService
      .getHotels()
      .then((res) => setHotels(res.data.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <h1>My Hotels</h1>

      {hotels.map((hotel) => (
        <div className="card" key={hotel.id}>
          <h2>{hotel.name}</h2>
          <p>{hotel.address}</p>
          <p>{hotel.city}</p>
          <p>{hotel.description}</p>
        </div>
      ))}
    </div>
  );
};

export default OwnerHotels;