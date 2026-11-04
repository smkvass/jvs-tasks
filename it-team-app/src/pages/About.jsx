
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <span className="about-label">ABOUT US</span>
        <h1>
          Better teamwork.
          <br />
          <span>Better results.</span>
        </h1>
        <p>
          A simple way to organize your IT team,
          manage members and track progress.
        </p>
        <Link to="/team" className="about-button">
          Meet the Team →
        </Link>
      </section>

      <section className="about-cards">
        <article className="about-card">
          <div className="about-icon">♧</div>
          <h3>Our Team</h3>
          <p>Explore member profiles and skills.</p>
        </article>

        <article className="about-card">
          <div className="about-icon">↗</div>
          <h3>Our Goal</h3>
          <p>Make team management simple.</p>
        </article>

        <article className="about-card">
          <div className="about-icon">◎</div>
          <h3>Our Focus</h3>
          <p>Collaboration, clarity and growth.</p>
        </article>
      </section>
    </main>
  );
}
