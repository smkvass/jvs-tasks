
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Loader from "../components/Loader";
import { getItem, updateItem } from "../services/Service.js";

export default function MemberDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [newStatus, setNewStatus] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const {
    data: member,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["team-member", id],
    queryFn: () => getItem(id),
  });


  const updateMutation = useMutation({
    mutationFn: (status) => updateItem(id, { status }),

    onSuccess: (updatedMember) => {
      queryClient.setQueryData(
        ["team-member", id],
        updatedMember
      );

      queryClient.invalidateQueries({
        queryKey: ["team"],
      });

      setSaveMessage("Status updated successfully!");
    },

    onError: (err) => {
      setSaveMessage("Error: " + err.message);
    },
  });

  
  useEffect(() => {
    if (member) {
      setNewStatus(member.status);
    }
  }, [member]);

  async function handleSave() {
    setSaveMessage("");
    updateMutation.mutate(newStatus);
  }

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {error.message}</p>;
  if (!member) return <h2>Member not found</h2>;

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
              disabled={
                updateMutation.isPending ||
                newStatus === member.status
              }
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
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
