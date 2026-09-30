function FilterBar({ filter, setFilter }) {
  return (
    <div className="filter">
      <button onClick={() => setFilter("All")}>
        All
      </button>

      <button onClick={() => setFilter("Not started")}>
        Not started
      </button>

      <button onClick={() => setFilter("In progress")}>
        In progress
      </button>

      <button onClick={() => setFilter("Completed")}>
        Completed
      </button>
    </div>
  );
}

export default FilterBar;