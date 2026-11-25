import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks.js";

import { fetchDashboard } from "../redux/dashboard/dashboardThunks.js";

import {
  setStatusFilter,
} from "../redux/dashboard/dashboardSlice.js";

import {
  selectFilteredItems,
  selectDashboardStats,
  selectStatusFilter,
  selectMembersByRole,
} from "../redux/dashboard/dashboardSelectors.js";

import Loader from "../components/Loader";
import PublicApiDemo from "../components/PublicApiDemo";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  // Получаем состояние загрузки и ошибки
  const { status, error } = useAppSelector(
    (state) => state.dashboard
  );

  // Получаем данные через селекторы
  const filteredItems = useAppSelector(selectFilteredItems);
  const stats = useAppSelector(selectDashboardStats);
  const statusFilter = useAppSelector(selectStatusFilter);
  const roles = useAppSelector(selectMembersByRole);

  // Загружаем данные при открытии Dashboard
  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (status === "loading" || status === "idle") {
    return <Loader />;
  }

  if (status === "failed") {
    return (
      <div className="dashboard">
        <p className="error">Error: {error}</p>

        <button onClick={() => dispatch(fetchDashboard())}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Team Dashboard</h1>
      <p>Overview of our IT team</p>

      <label>
        Filter by status:{" "}
        <select
          value={statusFilter}
          onChange={(e) =>
            dispatch(setStatusFilter(e.target.value))
          }
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
          <h2>{stats.total}</h2>
        </div>

        <div className="stat-card">
          <h3>Available</h3>
          <h2>{stats.available}</h2>
        </div>

        <div className="stat-card">
          <h3>Working</h3>
          <h2>{stats.working}</h2>
        </div>

        <div className="stat-card">
          <h3>On Leave</h3>
          <h2>{stats.onLeave}</h2>
        </div>

        <div className="stat-card">
          <h3>Average Experience</h3>
          <h2>{stats.averageExperience} years</h2>
        </div>
      </div>

      <section>
        <h2>Members by Status</h2>
        <ul>
          <li>Available: {stats.available}</li>
          <li>Working: {stats.working}</li>
          <li>On Leave: {stats.onLeave}</li>
        </ul>
      </section>

      <section>
        <h2>Members by Role</h2>

        {Object.keys(roles).length === 0 ? (
          <p>No members found.</p>
        ) : (
          <ul>
            {Object.entries(roles).map(([role, count]) => (
              <li key={role}>
                {role}: {count}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Team Members</h2>

          {filteredItems.length === 0 ? (
          <p>
          {stats.total === 0
           ? "No team members yet. Add your first member!"
            : "No members match this status."}
          </p>
          ) : (
          <ul>
            {filteredItems.map((item) => (
              <li key={item.id}>
                <Link to={`/team/${item.id}`}>
                  {item.name} {item.lastName || ""}
                </Link>
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

      <PublicApiDemo />
    </div>
  );
}