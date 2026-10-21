import Catalog from "./components/Catalog";

function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-content">
          <p>Fashion · Photography · Art · Design · Magazines</p>
          <h1>Aesthetic Bookshelf</h1>
          <span>books and magazines worth keeping</span>
        </div>
      </header>
      <Catalog />
    </div>
  );
}
export default App;