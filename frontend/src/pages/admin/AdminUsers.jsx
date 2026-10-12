import { useEffect, useState } from "react";
import { adminService } from "../../services/services";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user) => {
    try {
      await adminService.toggleUserStatus(
        user.id,
        !user.active
      );
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1>Manage Users</h1>

      {users.map((user) => (
        <div className="card" key={user.id}>
          <h3>{user.fullName}</h3>
          <p>{user.email}</p>
          <p>Role: {user.role}</p>
          <p>Status: {user.active ? "Active" : "Inactive"}</p>

          <button onClick={() => toggleStatus(user)}>
            {user.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;