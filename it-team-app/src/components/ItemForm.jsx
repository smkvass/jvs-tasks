import { useState } from "react";

export default function ItemForm({ initial, submitting, error, onSubmit, onCancel }) {
  
  const [values, setValues] = useState(() => ({
    name: initial?.name || "",
    description: initial?.description || "",
    role: initial?.role || "",
    location: initial?.location || "",
    experience: initial?.experience ?? 0,
    status: initial?.status || "available",
    skills: (initial?.skills || []).join(", "),
    joinedAt: initial?.joinedAt || new Date().toISOString().slice(0, 10),
  }));
  const [validation, setValidation] = useState("");

  function change(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    const experience = Number(values.experience);
    if (!values.name.trim() || !values.description.trim()) {
      setValidation("Name and description are required");
      return;
    }
    if (!Number.isInteger(experience) || experience < 0 || experience > 50) {
      setValidation("Experience must be a whole number of years from 0 to 50");
      return;
    }
    setValidation("");
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      role: values.role.trim(),
      location: values.location.trim(),
      experience,
      status: values.status,
      skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
      joinedAt: values.joinedAt,
    });
  }

  return (
    <div className="overlay">
      <form className="modal" onSubmit={submit}>
        <h2>{initial ? "Edit team member" : "New team member"}</h2>
        <label>Name *<input name="name" value={values.name} onChange={change} /></label>
        <label>Description *<input name="description" value={values.description} onChange={change} /></label>
        <div className="row">
          <label>Role<input name="role" value={values.role} onChange={change} /></label>
          <label>Location<input name="location" value={values.location} onChange={change} /></label>
        </div>
        <div className="row">
          <label>Experience (years)<input name="experience" type="number" value={values.experience} onChange={change} /></label>
          <label>Status
            <select name="status" value={values.status} onChange={change}>
              <option value="available">available</option>
              <option value="working">working</option>
              <option value="on_leave">on leave</option>
            </select>
          </label>
        </div>
        <label>Skills (comma separated)<input name="skills" value={values.skills} onChange={change} /></label>
        <label>Joined<input name="joinedAt" type="date" value={values.joinedAt} onChange={change} /></label>
        {(validation || error) && <p className="error">{validation || error}</p>}
        <div className="actions">
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Saving…" : "Save"}
          </button>
          <button type="button" disabled={submitting} onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
