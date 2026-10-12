import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelService } from "../services/services";

const Hotels = () => {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHotels = async (city = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await hotelService.getAll(city);

      console.log("Hotels API response:", response.data);

      const hotelData = response.data?.data;

      if (Array.isArray(hotelData)) {
        setHotels(hotelData);
      } else {
        setHotels([]);
      }
    } catch (err) {
      console.error("Hotels API error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load hotels. Please try again."
      );

      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = () => {
    fetchHotels(search.trim());
  };

  const clearFilters = () => {
    setSearch("");
    fetchHotels();
  };

  return (
    <div className="page-container">
      <h1>All Hotels</h1>

      <p>{hotels.length} hotels found</p>

      <div className="card">
        <input
          type="text"
          placeholder="Search by city or hotel name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button onClick={handleSearch}>
          Search
        </button>

        <button onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {loading && (
        <div className="card">
          <p>Loading hotels...</p>
        </div>
      )}

      {error && !loading && (
        <div className="card">
          <p className="error">{error}</p>
          <button onClick={() => fetchHotels()}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && hotels.length === 0 && (
        <div className="card">
          <h2>No hotels found</h2>
          <p>Try adjusting your search.</p>

          <button onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}

      {!loading && hotels.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginTop: "30px",
          }}
        >
          {hotels.map((hotel) => (
            <div
              className="card"
              key={hotel.id}
              style={{ overflow: "hidden" }}
            >
              {hotel.imageUrl && (
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              )}

              <h2>{hotel.name}</h2>

              <p>
                📍 {hotel.city}, {hotel.state}
              </p>

              <p>{hotel.description}</p>

              <p>
                ⭐ {hotel.rating ?? "N/A"}
              </p>

              <button
                onClick={() =>
                  navigate(`/hotels/${hotel.id}`)
                }
              >
                View Hotel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hotels;