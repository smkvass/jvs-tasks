import QuestCard from "./QuestCard";

function QuestList({
  quests,
  changeStatus,
  changeProgress,
  deleteQuest,
  resetQuest
}) {
  return (
    <div className="quest-list">
      {quests.map((quest) => (
        <QuestCard
          key={`${quest.id}-${quest.reset}`}
          quest={quest}
          changeStatus={changeStatus}
          changeProgress={changeProgress}
          deleteQuest={deleteQuest}
          resetQuest={resetQuest}
        />
      ))}
    </div>
  );
}

export default QuestList;