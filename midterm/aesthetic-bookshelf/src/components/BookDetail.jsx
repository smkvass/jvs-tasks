import { useState, useEffect } from "react";

function BookDetail({ book, onBack }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // свои книги ("my-...") есть только у тебя, на сервере их нет
    if (!book.key.startsWith("/works/")) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(`https://openlibrary.org${book.key}.json`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        const d = data.description;
        setDescription(typeof d === "string" ? d : d?.value || "");
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [book.key]);

  const cover = book.cover
    ? book.cover
    : book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : null;

  const author = book.author_name?.[0] ?? "Unknown author";

  return (
    <div className="detail">
      <button className="ghost" onClick={onBack}>← Back</button>

      <h2>{book.title}</h2>
      <p className="muted">
        {author}
        {book.first_publish_year && ` · ${book.first_publish_year}`}
      </p>

      {cover && <img className="detail-img" src={cover} alt={book.title} />}

      {loading && <p className="status">Loading description...</p>}
      {!loading && description && <p>{description}</p>}
      {!loading && !description && (
        <p className="muted">No description available.</p>
      )}
    </div>
  );
}
export default BookDetail;