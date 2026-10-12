import { useEffect, useState } from "react";
import { ownerService } from "../../services/services";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    ownerService
      .getDashboard()
      .then((res) => setDashboard(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <h1>Hotel Owner Dashboard</h1>

      <div className="card">
        {dashboard ? (
          <pre>{JSON.stringify(dashboard, null, 2)}</pre>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;