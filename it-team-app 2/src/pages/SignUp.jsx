
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, loginWithGoogle, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
      navigate("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setLoading(true);
    setFormError("");

    try {
      await loginWithGoogle();
      navigate("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <p>Create your account</p>

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (at least 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={6}
          required
        />

        {formError && <p className="error">{formError}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Create Account"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading}
      >
        Continue with Google
      </button>
    </div>
  );
}
