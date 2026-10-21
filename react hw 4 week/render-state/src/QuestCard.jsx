function QuestCard({
  quest,
  changeStatus,
  changeProgress,
  deleteQuest,
  resetQuest
}) {

  const displayProgress =
    quest.status === "Completed"
      ? 100
      : quest.progress;

  const handleStatusChange = (newStatus) => {
    changeStatus(quest.id, newStatus);
  };

  console.log(
    "QuestCard rendered:",
    quest.title,
    quest.progress
  );

  return (
    <div className="quest-card">

      <img
        src={quest.image}
        alt={quest.title}
        className="quest-image"
      />

      <div className="card-content">

        <div className="card-top">

          <span className="category">
            {quest.category}
          </span>

          <span className="quest-number">
            0{quest.id}
          </span>

        </div>

        <h2>{quest.title}</h2>

        <div className="card-info">

          <span
            className={`status ${quest.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {quest.status === "Completed" && "✓ "}
            {quest.status === "In progress" && "● "}
            {quest.status === "Not started" && "○ "}
            {quest.status}
          </span>

          <span className="difficulty">
            {quest.difficulty}
          </span>

        </div>

        <div className="progress-section">

          <div className="progress-label">
            <span>Progress</span>
            <span>{displayProgress}%</span>
          </div>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${displayProgress}%`
              }}
            ></div>

          </div>

        </div>

        <div className="card-actions">

          <button
            onClick={() => changeProgress(quest.id)}
          >
            +10%
          </button>

          <button
            onClick={() => resetQuest(quest.id)}
          >
            Reset
          </button>

          <button
            className="delete-button"
            onClick={() => deleteQuest(quest.id)}
          >
            ×
          </button>

        </div>

        <div className="status-actions">

          <button
            onClick={() =>
              handleStatusChange("Not started")
            }
          >
            Not started
          </button>

          <button
            onClick={() =>
              handleStatusChange("In progress")
            }
          >
            In progress
          </button>

          <button
            onClick={() =>
              handleStatusChange("Completed")
            }
          >
            Completed
          </button>

        </div>

      </div>
    </div>
  );
}

export default QuestCard;