import { useState } from "react";
import { userService } from "../../services/services";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [fullName, setFullName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await userService.updateProfile({
        fullName,
        phone,
      });

      const updatedUser = response.data.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Unable to update profile."
      );
    }
  };

  return (
    <div className="page-container">
      <h1>My Profile</h1>

      <form onSubmit={handleSubmit} className="card">
        {message && <p>{message}</p>}

        <label>Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label>Email</label>
        <input value={user.email || ""} disabled />

        <label>Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;