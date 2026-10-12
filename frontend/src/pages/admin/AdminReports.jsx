import { useEffect, useState } from "react";
import { adminService } from "../../services/services";

const AdminReports = () => {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    adminService
      .getReports()
      .then((res) => setReports(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <h1>Revenue & Reports</h1>

      <div className="card">
        {reports ? (
          <pre>{JSON.stringify(reports, null, 2)}</pre>
        ) : (
          <p>Loading reports...</p>
        )}
      </div>
    </div>
  );
};

export default AdminReports;