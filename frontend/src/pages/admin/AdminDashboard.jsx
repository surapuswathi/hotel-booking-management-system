import { useEffect, useState } from "react";
import { adminService } from "../../services/services";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => setDashboard(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>

      <div className="card">
        {dashboard ? (
          <pre>{JSON.stringify(dashboard, null, 2)}</pre>
        ) : (
          <p>Loading dashboard...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;