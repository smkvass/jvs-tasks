import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>UID:</strong> {user?.uid}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
