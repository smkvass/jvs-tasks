export default function Login() {
  return (
    <div className="login-page">
      <h1>Login</h1>
      <p>Authentication will be available in the future.</p>

      <form>
        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button type="button">
          Sign In
        </button>
      </form>
    </div>
  );
}
