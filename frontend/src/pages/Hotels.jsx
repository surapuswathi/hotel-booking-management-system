import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelService } from "../services/services";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      const hotelData = response.data?.data;
      setHotels(Array.isArray(hotelData) ? hotelData : []);
    } catch (err) {
      console.error("Hotels API error:", err);
      setError(
        err.response?.data?.message || "Unable to load hotels. Please try again."
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
    <>
      <Navbar />

      {/* Page header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 50%, #16213E 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "4rem 0 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "var(--primary)",
            filter: "blur(120px)",
            opacity: 0.06,
            top: -150,
            right: -100,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "var(--secondary)",
            filter: "blur(100px)",
            opacity: 0.04,
            bottom: -100,
            left: -50,
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.3)",
                padding: "0.4rem 1rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--primary-light)",
                marginBottom: "1rem",
              }}
            >
              🏨{" "}
              {loading
                ? "Loading…"
                : error
                ? "Hotel Search"
                : `${hotels.length} Hotel${hotels.length !== 1 ? "s" : ""} Available`}
            </div>
            <h1
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 800,
                marginBottom: "0.75rem",
              }}
            >
              Find Your Perfect{" "}
              <span
                style={{
                  background: "var(--grad-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Stay
              </span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>
              Discover premium hotels across India with the best deals
            </p>
          </div>

          {/* Search bar */}
          <div
            style={{
              background: "rgba(26,26,46,0.9)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-xl)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              maxWidth: 640,
              margin: "0 auto",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>🔍</span>
            <input
              type="text"
              placeholder="Search by city or hotel name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
            />
            {search && (
              <button
                onClick={clearFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "0.25rem",
                  lineHeight: 1,
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
              >
                ✕
              </button>
            )}
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSearch}
              style={{ flexShrink: 0 }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
        {/* Loading */}
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "6rem 2rem",
              gap: "1.25rem",
              color: "var(--text-muted)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                border: "3px solid var(--border)",
                borderTopColor: "var(--primary)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ fontWeight: 500 }}>Discovering hotels for you…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--bg-card)",
              border: "1px solid rgba(239,71,111,0.2)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>😕</div>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "1.15rem" }}>
              {error}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              The server may be temporarily unavailable. Please try again in a moment.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => fetchHotels()}
              style={{ marginTop: "0.5rem" }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && hotels.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🏨</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              No hotels found
            </h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Try a different city or clear your search.
            </p>
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Hotel grid */}
        {!loading && !error && hotels.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Showing{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {hotels.length}
                </strong>{" "}
                {hotels.length === 1 ? "hotel" : "hotels"}
                {search && (
                  <>
                    {" "}for{" "}
                    <strong style={{ color: "var(--primary-light)" }}>
                      "{search}"
                    </strong>
                  </>
                )}
              </p>
              {search && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={clearFilters}
                >
                  Clear search
                </button>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="hotel-card"
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                >
                  {hotel.imageUrl ? (
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="hotel-card-img"
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                      }}
                    />
                  ) : null}
                  <div
                    className="hotel-card-img-placeholder"
                    style={{ display: hotel.imageUrl ? 'none' : 'flex' }}
                  >🏨</div>

                  <div className="hotel-card-body">
                    <h3 className="hotel-card-name">{hotel.name}</h3>
                    <p className="hotel-card-location">
                      📍 {hotel.city}{hotel.state ? `, ${hotel.state}` : ""}
                    </p>

                    {hotel.description && (
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                          marginBottom: "0.75rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {hotel.description}
                      </p>
                    )}

                    {/* Amenity tags */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.35rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {hotel.amenities.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              padding: "0.2rem 0.55rem",
                              borderRadius: "var(--radius-full)",
                              background: "rgba(108,99,255,0.1)",
                              color: "var(--primary-light)",
                              border: "1px solid rgba(108,99,255,0.2)",
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="hotel-card-footer">
                      <div className="rating">
                        ⭐{" "}
                        {hotel.rating != null ? hotel.rating.toFixed(1) : "New"}
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/hotels/${hotel.id}`);
                        }}
                      >
                        View Rooms →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Hotels;