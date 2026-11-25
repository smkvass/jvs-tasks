import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import Loader from "../components/Loader";

import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks.js";

import { fetchMember } from "../redux/member/memberThunks.js";
import { clearMember } from "../redux/member/memberSlice.js";
import { editTeamMember } from "../redux/team/teamThunks.js";
import { fetchDashboard } from "../redux/dashboard/dashboardThunks.js";

export default function MemberDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const {
    currentMember: member,
    status,
    error,
    updateStatus,
    updateError,
  } = useAppSelector((state) => state.member);

  const [newStatus, setNewStatus] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  // Загружаем участника при открытии страницы
  useEffect(() => {
    dispatch(fetchMember(id));

    return () => {
      dispatch(clearMember());
    };
  }, [dispatch, id]);

  // Устанавливаем текущий статус в select
  useEffect(() => {
    if (member) {
      setNewStatus(member.status || "available");
    }
  }, [member?.status]);

  async function handleSave() {
    setSaveMessage("");

    try {
  await dispatch(
    editTeamMember({
      id,
      changes: { status: newStatus },
    })
  ).unwrap();

  dispatch(fetchDashboard());

  setSaveMessage("Status updated successfully!");
} catch (err) {
  setSaveMessage(
    "Error: " +
      (typeof err === "string"
        ? err
        : err.message || "Failed to update status")
  );
}
  }

  if (status === "loading" || status === "idle") {
    return <Loader />;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  if (!member) {
    return <h2>Member not found</h2>;
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
            <h1>
                {member.name} {member.lastName || ""}
            </h1>
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
              disabled={
                updateStatus === "loading" ||
                newStatus === member.status
              }
            >
              {updateStatus === "loading" ? "Saving..." : "Save Changes"}
            </button>

            {saveMessage && <p>{saveMessage}</p>}
            {updateError && <p>Error: {updateError}</p>}
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