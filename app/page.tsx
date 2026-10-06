import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { SkillList } from "@/components/skill-list";
import { LiveInterests } from "@/components/live-interests";
import { SystemsGraphic } from "@/components/systems-graphic";
import { researchExperience, workExperience } from "@/config/profile";
import { projects, siteConfig } from "@/config/site";
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Computer Science + Mathematics at
            UIUC
          </p>
          <h1>
            Baoren Liu
            <span className="accent" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="hero-description">
            I enjoy understanding how systems work and building practical
            software. My interests include AI research, full-stack web
            applications, and infrastructure.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="#work">
              View selected work <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button secondary" href="/resume">
              My résumé <span aria-hidden="true">↗</span>
            </Link>
            <a
              className="text-link hero-linkedin"
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-footnote">
            <span className="status-dot" /> Open to internship opportunities
          </div>
        </div>
        <div className="hero-visual">
          <SystemsGraphic />
        </div>
      </section>
      <section
        className="section container home-overview"
        aria-labelledby="work-experience-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / Current roles</p>
            <h2 id="work-experience-heading">Work experience</h2>
          </div>
          <Link className="text-link" href="/about">
            More about me <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="overview-grid">
          {workExperience.map((item) => (
            <article className="overview-card" key={item.organization}>
              <p className="eyebrow">{item.date}</p>
              <h3>{item.organization}</h3>
              <p className="overview-role">{item.role}</p>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section container">
        <div className="section-heading" id="work">
          <div>
            <p className="eyebrow">02 / Selected work</p>
            <h2>Highlighted projects</h2>
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
      <section className="section container skills-section">
        <p className="eyebrow">03 / My toolkit</p>
        <h2>Skills</h2>
        <SkillList />
      </section>
      <section className="research-band">
        <div className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / Healthcare and robotics</p>
              <h2>Research</h2>
            </div>
            <Link className="text-link" href="/about#research">
              More details <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="overview-grid">
            {researchExperience.map((item) => (
              <article className="overview-card" key={item.organization}>
                <h3>{item.role}</h3>
                <p className="overview-role">{item.organization}</p>
                <p>{item.summary}</p>
                {item.publication && (
                  <a
                    className="inline-link research-paper-link"
                    href={item.publication.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the preprint ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        className="section container personal-section"
        aria-labelledby="hobbies-heading"
      >
        <p className="eyebrow">05 / Outside of school</p>
        <h2 id="hobbies-heading">Games and music</h2>
        <p className="section-description">
          I play Clash of Clans, Asphalt Legends Unite, and Genshin Impact.
          Here’s what I’ve been playing and listening to lately.
        </p>
        <LiveInterests trackLimit={3} />
        <Link className="text-link hobbies-link" href="/about#hobbies">
          More about my hobbies <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="contact-section container" id="contacts">
        <p className="eyebrow">06 / Let’s connect</p>
        <h2>Get in touch</h2>
        <p>
          Feel free to reach out about internships, projects, or anything on
          this site.
        </p>
        <a className="contact-email" href={siteConfig.links.email}>
          liubaoren2006@gmail.com <span aria-hidden="true">↗</span>
        </a>
        <div className="contact-links">
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
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
