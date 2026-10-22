export default function ItemList({ items, selectedId, busyIds, onSelect }) {
  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item.id}>
          <button
            className={"list-item" + (item.id === selectedId ? " selected" : "")}
            onClick={() => onSelect(item.id)}
          >
            <span className="list-top">
              <strong>{item.name}</strong>
              <span className={"badge " + item.status}>
                {busyIds.includes(item.id) ? "saving…" : item.status.replace("_", " ")}
              </span>
            </span>
            <span className="muted">{item.description}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
