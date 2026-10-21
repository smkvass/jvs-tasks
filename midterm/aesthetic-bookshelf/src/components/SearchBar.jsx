import { useState } from "react";

function SearchBar({ initial = "", onSearch }) {
  const [text, setText] = useState(initial);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(text.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        className="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search books..."
      />
      <button>Search</button>
    </form>
  );
}
export default SearchBar;