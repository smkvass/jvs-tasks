import { Link } from "react-router-dom";

export default function Card({ item, onEdit, onDelete }) {
  return (
    <div className="team-card">
      <div className="card-header">
        <h3>{item.name}</h3>
        <span className={`badge ${item.status || "available"}`}>
          {(item.status || "available").replace("_", " ")}
        </span>
      </div>

      <p>{item.role || "No role specified"}</p>
      <p className="muted">{item.location || "No location specified"}</p>
      <p>Experience: {item.experience ?? 0} years</p>
      <p>Skills: {item.skills?.join(", ") || "Not specified"}</p>
      <p>Joined: {item.joinedAt || "Not specified"}</p>

      <Link to={`/team/${item.id}`}>View Details →</Link>

      <div className="card-actions">
        <button onClick={() => onEdit(item)}>Edit</button>
        <button onClick={() => onDelete(item.id)}>Delete</button>
      </div>
    </div>
  );
}