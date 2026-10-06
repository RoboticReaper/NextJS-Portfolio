import Link from "next/link";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/config/site";
export const metadata: Metadata = { title: "Projects" };
export default function ProjectsPage() {
  return (
    <div className="projects-page dense-page">
      <header className="page-heading">
        <p className="eyebrow">Applications and experiments</p>
        <h1>Projects</h1>
        <p>Some applications and experiments I’ve worked on.</p>
      </header>
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
      <section className="writing-section">
        <p className="eyebrow">Writing</p>
        <h2>Notes</h2>
        <Link className="writing-card" href="/projects/ctf">
          <span>01</span>
          <div>
            <h3>Capture The Flag</h3>
            <p>A note from my first UIUC CTF experience.</p>
          </div>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
