import { useState } from "react";

function AddQuestForm({ addQuest }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Music");
  const [difficulty, setDifficulty] = useState("Easy");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      return;
    }

    const newQuest = {
      id: Date.now(),
      title: title,
      category: category,
      difficulty: difficulty,
      status: "Not started"
    };

    addQuest(newQuest);

    setTitle("");
    setCategory("Music");
    setDifficulty("Easy");
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Quest title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="Music">Music</option>
        <option value="Sport">Sport</option>
        <option value="Education">Education</option>
        <option value="Art">Art</option>
      </select>

      <select
        value={difficulty}
        onChange={(event) => setDifficulty(event.target.value)}
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <button type="submit">
        Add Quest
      </button>
    </form>
  );
}

export default AddQuestForm;