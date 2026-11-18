import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export default function PublicApiDemo() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [error, setError] = useState("");

  async function loadPosts() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load posts");
      }

      const data = await response.json();

      setPosts(data.slice(0, 5));
      setIsCached(response.headers.get("X-Data-Source") === "cache");
    } catch {
      setError("Unable to load posts.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <section>
      <h2>Public API Demo</h2>

      {isLoading && <p>Loading posts...</p>}
      {isCached && <p>Showing cached data (offline mode)</p>}
      {error && <p>{error}</p>}

      {posts.map((post) => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </article>
      ))}

      <button onClick={loadPosts}>Retry</button>
    </section>
  );
}