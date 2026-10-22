export default function ItemDetails({ item, busy, onEdit, onComplete, onDelete }) {
  const rows = [
    ["Role", item.role],
    ["Location", item.location],
    ["Experience (years)", item.experience],
    ["Status", item.status ? item.status.replace("_", " ") : item.status],
    ["Skills", (item.skills || []).join(", ")],
    ["Joined", item.joinedAt],
    ["Tasks completed", item.tasksCompleted],
  ];

  let actionLabel = "Start task";
  if (item.status === "working") actionLabel = "Complete task";
  if (item.status === "on_leave") actionLabel = "On leave";

  return (
    <div>
      <h2>{item.name}</h2>
      <p className="muted">{item.description}</p>
      <dl className="fields">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value === undefined || value === "" ? "—" : value}</dd>
          </div>
        ))}
      </dl>
      <div className="actions">
        {/* pass the whole item: its id is captured at click time */}
        <button
          className="primary"
          disabled={busy || item.status === "on_leave"}
          onClick={() => onComplete(item)}
        >
          {busy ? "Saving…" : actionLabel}
        </button>
        <button disabled={busy} onClick={() => onEdit(item)}>Edit</button>
        <button className="danger" disabled={busy} onClick={() => onDelete(item)}>Remove</button>
      </div>
    </div>
  );
}
