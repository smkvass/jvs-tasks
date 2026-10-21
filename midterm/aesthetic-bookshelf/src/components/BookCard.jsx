function BookCard({ book, onOpen }) {
  const cover = book.cover
    ? book.cover
    : book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  const author = book.author_name?.[0] ?? "Unknown author";

  return (
    <article className="card" onClick={() => onOpen(book)}>
      {cover ? (
        <img src={cover} alt={book.title} loading="lazy" />
      ) : (
        <div className="no-cover">No cover</div>
      )}
      <p className="brand">{author}</p>
      <h3>{book.title}</h3>
      {book.first_publish_year && (
        <p className="price">{book.first_publish_year}</p>
      )}
    </article>
  );
}
export default BookCard;