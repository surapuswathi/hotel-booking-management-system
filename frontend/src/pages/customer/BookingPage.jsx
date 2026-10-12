import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  hotelService,
  roomService,
  bookingService,
} from "../../services/services";

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

  // Get today's date in YYYY-MM-DD format.
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Fetch the selected room and its hotel.
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        setError("");

        if (!roomId) {
          setError("Room ID is missing. Please select a room again.");
          return;
        }

        const response = await roomService.getById(roomId);

        // Support common API response wrappers.
        const roomData =
          response.data?.data ??
          response.data?.room ??
          response.data;

        if (!roomData || !roomData.id) {
          throw new Error("Room details could not be found.");
        }

        setRoom(roomData);

        const capacity = Number(roomData.capacity ?? 1);
        setGuests(Math.max(1, Math.min(1, capacity)));

        // Fetch hotel details if the room response contains a hotel ID.
        const hotelId =
          roomData.hotel?.id ??
          roomData.hotelId;

        if (hotelId) {
          try {
            const hotelResponse = await hotelService.getById(hotelId);

            const hotelData =
              hotelResponse.data?.data ??
              hotelResponse.data?.hotel ??
              hotelResponse.data;

            setHotel(hotelData);
          } catch (hotelError) {
            console.error("Unable to fetch hotel details:", hotelError);
          }
        }
      } catch (err) {
        console.error("Unable to fetch room:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load room details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  // Validate dates and guest count before submitting.
  const validateBooking = () => {
    if (!room) {
      return "Room details are unavailable.";
    }

    if (!checkInDate || !checkOutDate) {
      return "Please select both check-in and check-out dates.";
    }

    if (checkInDate < todayString) {
      return "Check-in date cannot be in the past.";
    }

    if (checkOutDate <= checkInDate) {
      return "Check-out date must be after check-in date.";
    }

    const capacity = Number(room.capacity ?? 1);
    const guestCount = Number(guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return "Please enter a valid number of guests.";
    }

    if (guestCount > capacity) {
      return `This room accommodates a maximum of ${capacity} guest(s).`;
    }

    return "";
  };

  // Create the booking.
  const handleBooking = async (event) => {
    event.preventDefault();

    const validationError = validateBooking();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setBookingLoading(true);
      setError("");

      const response = await bookingService.create({
        roomId: Number(roomId),
        checkInDate,
        checkOutDate,
        numberOfRooms: 1,
        numberOfGuests: Number(guests),
      });

      const booking =
        response.data?.data ??
        response.data?.booking ??
        response.data;

      if (!booking?.id) {
        throw new Error(
          "Booking was submitted, but the booking ID was not returned."
        );
      }

      // Continue to the payment page using the booking ID.
      navigate(`/customer/payment/${booking.id}`);
    } catch (err) {
      console.error("Booking failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to create booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <p>Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Room unavailable</h2>
          <p className="error">{error || "Room details could not be found."}</p>

          <button onClick={() => navigate("/hotels")}>
            Browse Hotels
          </button>
        </div>
      </div>
    );
  }

  const capacity = Number(room.capacity ?? 1);
  const price = Number(room.price ?? room.pricePerNight ?? 0);

  const nights =
    checkInDate && checkOutDate && checkOutDate > checkInDate
      ? Math.round(
          (new Date(`${checkOutDate}T00:00:00`).getTime() -
            new Date(`${checkInDate}T00:00:00`).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalAmount = price * nights;

  return (
    <div className="page-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1>Book Your Room</h1>
      <p>Select your dates and the number of guests for your stay.</p>

      <div className="booking-layout">
        {/* Room information */}
        <section className="card">
          {room.imageUrl && (
            <img
              src={room.imageUrl}
              alt={room.roomType?.name || "Hotel room"}
              className="booking-room-image"
            />
          )}

          <h2>{hotel?.name || room.hotel?.name || "Selected Hotel"}</h2>

          {hotel && (
            <p>
              {hotel.city}
              {hotel.state ? `, ${hotel.state}` : ""}
              {hotel.country ? `, ${hotel.country}` : ""}
            </p>
          )}

          <h3>{room.roomType?.name || "Hotel Room"}</h3>

          <p>
            <strong>Room number:</strong> {room.roomNumber || "N/A"}
          </p>

          <p>
            <strong>Maximum capacity:</strong> {capacity} guest(s)
          </p>

          <p>
            <strong>Price per night:</strong>{" "}
            {price.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 2,
            })}
          </p>
        </section>

        {/* Booking form */}
        <section className="card">
          <h2>Booking Details</h2>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label htmlFor="checkInDate">Check-in Date</label>

              <input
                id="checkInDate"
                type="date"
                min={todayString}
                value={checkInDate}
                onChange={(event) => {
                  setCheckInDate(event.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="checkOutDate">Check-out Date</label>

              <input
                id="checkOutDate"
                type="date"
                min={checkInDate || todayString}
                value={checkOutDate}
                onChange={(event) => {
                  setCheckOutDate(event.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="guests">Number of Guests</label>

              <input
                id="guests"
                type="number"
                min="1"
                max={capacity}
                step="1"
                value={guests}
                onChange={(event) => {
                  const value = event.target.value;

                  if (value === "") {
                    setGuests("");
                    setError("");
                    return;
                  }

                  const number = Number(value);

                  if (number >= 1 && number <= capacity) {
                    setGuests(number);
                  }

                  setError("");
                }}
                required
              />

              <small>
                This room accommodates up to {capacity} guest(s).
              </small>
            </div>

            <div className="booking-summary">
              <h3>Price Summary</h3>

              <p>
                Price per night:{" "}
                <strong>
                  {price.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </strong>
              </p>

              <p>
                Number of nights: <strong>{nights}</strong>
              </p>

              <h3>
                Estimated total:{" "}
                {totalAmount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </h3>

              <small>
                The final amount is determined by the backend.
              </small>
            </div>

            <button
              type="submit"
              disabled={bookingLoading || !room}
              className="primary-button"
            >
              {bookingLoading
                ? "Creating Booking..."
                : "Continue to Payment →"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default BookingPage;