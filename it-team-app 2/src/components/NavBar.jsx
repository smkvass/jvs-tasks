
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <nav className="navbar">
      <h2>IT Team</h2>

      <div className="nav-links">
        <span
          className={`connection-status ${
            isOnline ? "online" : "offline"
          }`}
          title={isOnline ? "Internet connected" : "No internet connection"}
        >
          <span className="connection-dot"></span>
          {isOnline ? "Online" : "Offline"}
        </span>

        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/team">Team</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>

        {user ? (
          <>
            <NavLink to="/profile">Profile</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
