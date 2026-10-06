import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { projects, siteConfig, skills } from "@/config/site";
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Developer · Problem solver · Curious
            human
          </p>
          <h1>
            Baoren Liu
            <span className="accent" aria-hidden="true">
              .
            </span>
          </h1>
          <h2>
            I build things
            <br />
            that <span className="hero-emphasis">make a difference.</span>
          </h2>
          <p className="hero-description">
            Computer Science + Mathematics at UIUC.
            <br className="desktop-break" /> Turning everyday problems into
            useful software.
            <br className="desktop-break" /> Always learning. Always building.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="#work">
              View selected work <span aria-hidden="true">↗</span>
            </Link>
            <a
              className="button secondary"
              href={siteConfig.links.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              My résumé <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-footnote">
            <span className="status-dot" /> Open to internship opportunities
          </div>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="visual-coordinate top">40.1106° N / 88.2073° W</div>
          <div className="portrait-frame">
            <img
              src="/Baoren Liu Portrait.jpg"
              alt="Portrait of Baoren Liu"
              fetchPriority="high"
              width={480}
              height={687}
            />
          </div>
          <div className="floating-label label-code">
            <span className="accent">&lt;/&gt;</span> Ideas into impact.
          </div>
          <div className="floating-label label-location">
            <span className="status-dot" /> Based in Urbana-Champaign
          </div>
          <span className="visual-plus" aria-hidden="true">
            ✳
          </span>
          <div className="visual-coordinate bottom">BUILD. LEARN. REPEAT.</div>
        </div>
      </section>
      <div className="container">
        <div className="metrics-strip">
          <div>
            <strong>
              1,300<span>+</span>
            </strong>
            <span>Peak schedule app users</span>
          </div>
          <div>
            <strong>
              7k<span>+</span>
            </strong>
            <span>Notes app downloads</span>
          </div>
          <div>
            <strong>
              400<span>~</span>
            </strong>
            <span>Hours of community service</span>
          </div>
          <p>
            Small ideas.
            <br />
            <span>Real-world impact.</span>
          </p>
        </div>
      </div>
      <section className="section container" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / Selected work</p>
            <h2>Built with purpose.</h2>
          </div>
          <Link className="text-link" href="/projects">
            All projects <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="project-grid">
          {projects.slice(0, 2).map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>
      <section className="about-band">
        <div className="container about-band-inner">
          <div>
            <p className="eyebrow">02 / A little about me</p>
            <h2>
              Curiosity is
              <br />
              my default setting.
            </h2>
          </div>
          <div>
            <p>
              I’ve been writing code since 2018. What keeps me going is the
              moment an idea becomes something someone can actually use.
            </p>
            <p>
              From building tools for my school to exploring AI in healthcare,
              I’m interested in the space where thoughtful engineering meets
              real human problems.
            </p>
            <Link className="text-link" href="/about">
              More about me <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section container skills-section">
        <p className="eyebrow">03 / My toolkit</p>
        <h2>
          Different tools.
          <br />
          One builder’s mindset.
        </h2>
        <div className="skill-list">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
      <section className="contact-section container" id="contacts">
        <p className="eyebrow">04 / Let’s connect</p>
        <h2>
          Have something
          <br />
          in mind<span className="accent">?</span>
        </h2>
        <p>
          I’d love to hear about it. Projects, opportunities,
          <br className="desktop-break" /> or just a good conversation.
        </p>
        <a className="contact-email" href={siteConfig.links.email}>
          liubaoren2006@gmail.com <span aria-hidden="true">↗</span>
        </a>
        <div className="contact-links">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
          <a
            href={siteConfig.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram ↗
          </a>
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord ↗
          </a>
          <a
            href={siteConfig.links.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé ↗
          </a>
        </div>
      </section>
    </>
  );
}
