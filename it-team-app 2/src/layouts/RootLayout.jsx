import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function RootLayout() {
  return (
    <div className="app-layout">
      <NavBar />

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 IT Team Manager</p>
      </footer>
    </div>
  );
}
