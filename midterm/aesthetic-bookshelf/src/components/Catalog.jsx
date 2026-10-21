import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import BookCard from "./BookCard";
import Pagination from "./Pagination";
import AddBookForm from "./AddBookForm";
import BookDetail from "./BookDetail";

const LIMIT = 20;
const MIN_YEAR = 2010;
const CATEGORIES = [
  { value: "fashion", label: "Fashion" },
  { value: "photography", label: "Photography" },
  { value: "art", label: "Art" },
  { value: "design", label: "Design" },
  { value: "magazines", label: "Magazines" },
];

function loadMyBooks() {
  try {
    return JSON.parse(localStorage.getItem("myBooks")) || [];
  } catch {
    return [];
  }
}

function Catalog() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("fashion");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [myBooks, setMyBooks] = useState(loadMyBooks);

  // сохраняем мою полку
  useEffect(() => {
    localStorage.setItem("myBooks", JSON.stringify(myBooks));
  }, [myBooks]);

  // загрузка книг
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const q = `${search} subject:"${subject}" first_publish_year:[${MIN_YEAR} TO *]`;
    const params = new URLSearchParams({
      q,
      page,
      limit: LIMIT,
      fields: "key,title,author_name,first_publish_year,cover_i",
    });
    if (sort) params.set("sort", sort);

    fetch(`https://openlibrary.org/search.json?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setBooks(data.docs);
        setTotal(data.numFound);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [search, subject, sort, page]);

  function handleSearch(text) {
    setSearch(text);
    setPage(1);
  }
  function handleSubject(value) {
    setSubject(value);
    setPage(1);
  }
  function handleSort(e) {
    setSort(e.target.value);
    setPage(1);
  }
  function resetFilters() {
    setSearch("");
    setSubject("fashion");
    setSort("");
    setPage(1);
  }
  function addBook(book) {
    setMyBooks([book, ...myBooks]);
  }

  if (selected) {
    return <BookDetail key={selected.key} book={selected} onBack={() => setSelected(null)} />;
  }

  const totalPages = Math.min(Math.ceil(total / LIMIT), 50);

  return (
    <div>
      <SearchBar key={search} initial={search} onSearch={handleSearch} />

      <div className="filter">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            className={subject === c.value ? "active" : ""}
            onClick={() => handleSubject(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <select value={sort} onChange={handleSort}>
          <option value="">Relevance</option>
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
          <option value="rating">Top rated</option>
        </select>
        <button className="ghost" onClick={resetFilters}>Reset</button>
      </div>

      <h2>My shelf</h2>
      <AddBookForm onAdd={addBook} />
      {myBooks.length === 0 ? (
        <p className="muted">Your shelf is empty. Add a book above.</p>
      ) : (
        <div className="grid">
          {myBooks.map((b) => (
            <BookCard key={b.key} book={b} onOpen={setSelected} />
          ))}
        </div>
      )}

      <h2>
        Catalog {!loading && !error && <span className="muted">({total} books)</span>}
      </h2>

      {loading && <p className="status">Loading books...</p>}
      {error && <p className="status error">Error: {error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="status">No books found.</p>
      )}
      {!loading && !error && books.length > 0 && (
        <>
          <div className="grid">
            {books.map((b) => (
              <BookCard key={b.key} book={b} onOpen={setSelected} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
export default Catalog;