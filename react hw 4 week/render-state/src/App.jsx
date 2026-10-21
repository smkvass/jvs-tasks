import { useState } from "react";
import "./App.css";
import QuestList from "./QuestList";
import FilterBar from "./FilterBar";
import AddQuestForm from "./AddQuestForm";

import pianoImage from "./assets/piano.jpg";
import hikingImage from "./assets/hiking.jpg";
import guitarImage from "./assets/guitar.jpg";
import readingImage from "./assets/reading3.jpg";
import runningImage from "./assets/running.jpg";
import hacathonImage from "./assets/coding.jpg";
import hwImage from "./assets/hw.jpg";
import singImage from "./assets/singing.jpg";
import heroImage from "./assets/quest.jpg";
import paintImage from "./assets/paint.jpg";
import shootingImage from "./assets/shooting.jpg";

const initialQuests = [
  {
    id: 1,
    title: "Play on piano",
    category: "Music",
    difficulty: "Medium",
    status: "In progress",
    image: pianoImage,
    progress: 40,
    reset: 0
  },
  {
    id: 2,
    title: "Hiking",
    category: "Sport",
    difficulty: "Hard",
    status: "Completed",
    image: hikingImage,
    progress: 100,
    reset: 0
  },
  {
    id: 3,
    title: "Play on the guitar",
    category: "Music",
    difficulty: "Medium",
    status: "In progress",
    image: guitarImage,
    progress: 30,
    reset: 0
  },
  {
    id: 4,
    title: "Running 5 km",
    category: "Sport",
    difficulty: "Medium",
    status: "Not started",
    image: runningImage,
    progress: 0,
    reset: 0
  },
  {
    id: 5,
    title: "Reading a book",
    category: "Education",
    difficulty: "Medium",
    status: "In progress",
    image: readingImage,
    progress: 60,
    reset: 0
  },
  {
    id: 6,
    title: "Participate in a hackathon",
    category: "Education",
    difficulty: "Hard",
    status: "Completed",
    image: hacathonImage,
    progress: 100,
    reset: 0
  },
  {
    id: 7,
    title: "Finish homework",
    category: "Education",
    difficulty: "Easy",
    status: "Completed",
    image: hwImage,
    progress: 100,
    reset: 0
  },
  {
    id: 8,
    title: "Sing a song",
    category: "Music",
    difficulty: "Hard",
    status: "Not started",
    image: singImage,
    progress: 0,
    reset: 0
  },
  {
    id: 9,
    title: "Paint",
    category: "Art",
    difficulty: "Medium",
    status: "In progress",
    image: paintImage,
    progress: 50,
    reset: 0
  },
  {
    id: 10,
    title: "Shooting a film",
    category: "Art",
    difficulty: "Hard",
    status: "Not started",
    image: shootingImage,
    progress: 0,
    reset: 0
  }
];

function App() {
  const [quests, setQuests] = useState(initialQuests);
  const [filter, setFilter] = useState("All");

  const filteredQuests =
    filter === "All"
      ? quests
      : quests.filter((quest) => quest.status === filter);

  const changeStatus = (id, newStatus) => {
    setQuests(
      quests.map((quest) =>
        quest.id === id
          ? {
              ...quest,
              status: newStatus,
              progress:
                newStatus === "Completed"
                  ? 100
                  : newStatus === "Not started"
                  ? 0
                  : quest.progress
            }
          : quest
      )
    );
  };

  const changeProgress = (id) => {
    setQuests(
      quests.map((quest) => {
        if (quest.id !== id) {
          return quest;
        }

        const newProgress = Math.min(quest.progress + 10, 100);

        return {
          ...quest,
          progress: newProgress,
          status:
            newProgress === 100
              ? "Completed"
              : newProgress > 0
              ? "In progress"
              : "Not started"
        };
      })
    );
  };

  const deleteQuest = (id) => {
    setQuests(
      quests.filter((quest) => quest.id !== id)
    );
  };

  const resetQuest = (id) => {
    setQuests(
      quests.map((quest) =>
        quest.id === id
          ? {
              ...quest,
              progress: 0,
              status: "Not started",
              reset: (quest.reset || 0) + 1
            }
          : quest
      )
    );
  };

  const addQuest = (newQuest) => {
    setQuests([
      ...quests,
      {
        ...newQuest,
        progress: newQuest.progress || 0
      }
    ]);
  };

  const reverseQuests = () => {
    setQuests([...quests].reverse());
  };

  return (
    <div className="page">

      <section className="hero">
        <img
          src={heroImage}
          alt="My quests"
          className="hero-image"
        />

        <div className="hero-content">
          <p>2026 / MY LITTLE GOALS</p>
          <h1>MY QUESTS</h1>
          <span>small steps, big dreams</span>
        </div>
      </section>

      <section className="dashboard">

        <div className="stats">

          <div>
            <strong>{quests.length}</strong>
            <span> - Total quests </span>
          </div>

          <div>
            <strong>
              {
                quests.filter(
                  (quest) => quest.status === "Completed"
                ).length
              }
            </strong>
            <span> - Completed </span>
          </div>

          <div>
            <strong>
              {quests.length === 0
                ? 0
                : Math.round(
                    (quests.filter(
                      (quest) => quest.status === "Completed"
                    ).length /
                      quests.length) *
                      100
                  )}
              %
            </strong>
            <span> - Progress </span>
          </div>

        </div>

        <AddQuestForm addQuest={addQuest} />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
        />

        <button
          className="reverse-button"
          onClick={reverseQuests}
        >
          Reverse ↕
        </button>

        <QuestList
          quests={filteredQuests}
          changeStatus={changeStatus}
          changeProgress={changeProgress}
          deleteQuest={deleteQuest}
          resetQuest={resetQuest}
        />

      </section>
    </div>
  );
}

export default App;