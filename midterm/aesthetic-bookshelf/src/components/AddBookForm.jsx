import { useState } from "react";

const CURRENT_YEAR = new Date().getFullYear();

function AddBookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (year !== "") {
      const y = Number(year);
      if (!Number.isInteger(y) || y < 1 || y > CURRENT_YEAR) {
        setError(`Year must be between 1 and ${CURRENT_YEAR}.`);
        return;
      }
    }

    onAdd({
      key: "my-" + Date.now(),
      title: title.trim(),
      author_name: [author.trim() || "Unknown author"],
      first_publish_year: year,
      cover: image.trim(),
    });

    setTitle("");
    setAuthor("");
    setYear("");
    setImage("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <input
        placeholder="Year"
        type="number"
        min="1"
        max={CURRENT_YEAR}
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <input
        placeholder="Cover image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button>Add to my shelf</button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
export default AddBookForm;