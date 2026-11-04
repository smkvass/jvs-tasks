import { Link } from "react-router-dom";
import teamImage from "../assets/team.jpg";

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-text">
          <span className="home-label">WELCOME TO YOUR WORKSPACE</span>

          <h1>
            Great teams.
            <br />
            Greater <span>results.</span>
          </h1>

          <p>
            Discover your IT team, explore member profiles,
            and keep everyone connected in one place.
          </p>

          <div className="home-buttons">
            <Link to="/team" className="home-btn primary-btn">
              Explore Our Team →
            </Link>

            <Link to="/dashboard" className="home-btn secondary-btn">
              View Dashboard
            </Link>
          </div>

          <div className="home-note">
            <span className="home-dot"></span>
            Everything your team needs, in one place.
          </div>
        </div>

        <div className="home-visual">
          <img
            src={teamImage}
            alt="Team members collaborating on a project"
          />
        </div>
      </section>

      <section className="home-features">
        <article className="feature-card">
          <div className="feature-icon">♧</div>
          <h3>Our Team</h3>
          <p>Explore profiles, roles and skills.</p>
          <Link to="/team">Meet the team →</Link>
        </article>

        <article className="feature-card">
          <div className="feature-icon">▦</div>
          <h3>Dashboard</h3>
          <p>Track team statistics and status.</p>
          <Link to="/dashboard">View overview →</Link>
        </article>

        <article className="feature-card">
          <div className="feature-icon">↗</div>
          <h3>Our Mission</h3>
          <p>Make teamwork clearer and simpler.</p>
          <Link to="/about">Learn more →</Link>
        </article>
      </section>
    </main>
  );
}
