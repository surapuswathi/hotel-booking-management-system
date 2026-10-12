import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { paymentService } from "../../services/services";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [method, setMethod] = useState("CARD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await paymentService.process({
        bookingId: Number(bookingId),
        paymentMethod: method,
      });

      const payment = response.data.data;

      if (payment) {
        navigate(`/booking-confirmation/${bookingId}`);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Payment failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Payment</h1>

      <form onSubmit={handlePayment} className="card">
        {error && <p className="error">{error}</p>}

        <label>Payment Method</label>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
          <option value="CASH">Cash</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
