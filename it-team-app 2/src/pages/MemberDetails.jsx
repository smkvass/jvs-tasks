
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { getItem, updateItem } from "../services/Service.js";

export default function MemberDetails() {
  const { id } = useParams();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMember() {
      setLoading(true);
      setError("");

      try {
        const result = await getItem(id);

        if (!ignore) {
          setMember(result);
          setNewStatus(result.status);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMember();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  if (!member) return <h2>Member not found</h2>;

async function handleSave() {
  setSaving(true);
  setSaveMessage("");

  try {
    await updateItem(id, { status: newStatus });

    const updatedMember = await getItem(id);
    setMember(updatedMember);
    setNewStatus(updatedMember.status);

    setSaveMessage("Status updated successfully!");
  } catch (err) {
    setSaveMessage("Error: " + err.message);
  } finally {
    setSaving(false);
  }
}

return (
  
  <div className="member-details">
    <Link className="back-link" to="/team">
      ← Back to Team
    </Link>

    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {member.name.charAt(0)}
        </div>

        <div>
          <h1>{member.name}</h1>
          <p>{member.role}</p>
          <span className={`badge ${member.status || "available"}`}>
            {(member.status || "available").replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="profile-info">
        <div>
          <span>Location</span>
          <strong>{member.location}</strong>
        </div>

        <div>
  <span>Change status</span>

  <select
    value={newStatus}
    onChange={(e) => setNewStatus(e.target.value)}
  >
    <option value="available">Available</option>
    <option value="working">Working</option>
    <option value="on_leave">On Leave</option>
  </select>

  <button
    onClick={handleSave}
    disabled={saving || newStatus === member.status}
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>

  {saveMessage && <p>{saveMessage}</p>}
</div>

        <div>
          <span>Experience</span>
          <strong>{member.experience} years</strong>
        </div>

        <div>
          <span>Skills</span>
          <strong>
            {Array.isArray(member.skills)
              ? member.skills.join(", ")
              : member.skills || "Not specified"}
          </strong>
        </div>

        <div>
          <span>Joined</span>
          <strong>{member.joinedAt || "Not specified"}</strong>
        </div>

        <div>
          <span>Tasks completed</span>
          <strong>{member.tasksCompleted ?? 0}</strong>
        </div>

        <div>
          <span>Description</span>
          <strong>{member.description || "Not specified"}</strong>
        </div>
      </div>
    </div>
  </div>
);

}
