
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getItemsList } from "../services/Service.js";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const result = await getItemsList("limit=1000");
        if (!ignore) setItems(result.data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="dashboard">
        <p className="error">Error: {error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const filteredItems =
    statusFilter === "all"
      ? items
      : items.filter((item) => item.status === statusFilter);

  const total = filteredItems.length;
  const available = filteredItems.filter(
    (item) => item.status === "available"
  ).length;
  const working = filteredItems.filter(
    (item) => item.status === "working"
  ).length;
  const onLeave = filteredItems.filter(
    (item) => item.status === "on_leave"
  ).length;

  const averageExperience = total
    ? (
        filteredItems.reduce(
          (sum, item) => sum + (Number(item.experience) || 0),
          0
        ) / total
      ).toFixed(1)
    : "0";

  const roles = [...new Set(filteredItems.map(
    (item) => item.role || "Not specified"
  ))];

  return (
    <div className="dashboard">
      <h1>Team Dashboard</h1>
      <p>Overview of our IT team</p>

      <label>
        Filter by status:{" "}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="working">Working</option>
          <option value="on_leave">On Leave</option>
        </select>
      </label>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Members</h3>
          <h2>{total}</h2>
        </div>
        <div className="stat-card">
          <h3>Available</h3>
          <h2>{available}</h2>
        </div>
        <div className="stat-card">
          <h3>Working</h3>
          <h2>{working}</h2>
        </div>
        <div className="stat-card">
          <h3>On Leave</h3>
          <h2>{onLeave}</h2>
        </div>
        <div className="stat-card">
          <h3>Average Experience</h3>
          <h2>{averageExperience} years</h2>
        </div>
      </div>

      <section>
        <h2>Members by Status</h2>
        <ul>
          <li>Available: {available}</li>
          <li>Working: {working}</li>
          <li>On Leave: {onLeave}</li>
        </ul>
      </section>

      <section>
        <h2>Members by Role</h2>
        {roles.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <ul>
            {roles.map((role) => (
              <li key={role}>
                {role}:{" "}
                {filteredItems.filter(
                  (item) => (item.role || "Not specified") === role
                ).length}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Team Members</h2>
        {filteredItems.length === 0 ? (
          <p>No members match this status.</p>
        ) : (
          <ul>
            {filteredItems.map((item) => (
              <li key={item.id}>
                <Link to={`/team/${item.id}`}>{item.name}</Link>
                {" — "}
                {item.role || "No role specified"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p>
        <Link to="/team">View All Team Members →</Link>
      </p>
    </div>
  );
}
