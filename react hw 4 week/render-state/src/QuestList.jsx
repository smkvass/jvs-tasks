import QuestCard from "./QuestCard";

function QuestList({ quests, changeStatus, deleteQuest, resetQuest }) {
  return (
    <div className="quest-list">
      {quests.map((quest) => (
        <QuestCard
          key={`${quest.id}-${quest.reset || 0}`}
          quest={quest}
          changeStatus={changeStatus}
          deleteQuest={deleteQuest}
          resetQuest={resetQuest}
        />
      ))}
    </div>
  );
}

export default QuestList;