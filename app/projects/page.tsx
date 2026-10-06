import Link from "next/link";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/config/site";
export const metadata: Metadata = { title: "Projects" };
export default function ProjectsPage() {
  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">The things I’ve made</p>
        <h1>Built with purpose.</h1>
        <p>
          Real problems, curious experiments, and lessons learned along the way.
        </p>
      </header>
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
      <section className="writing-section">
        <p className="eyebrow">Notes from the journey</p>
        <h2>Learning in public.</h2>
        <Link className="writing-card" href="/projects/ctf">
          <span>01</span>
          <div>
            <h3>Capture The Flag</h3>
            <p>A note from my first UIUC CTF experience.</p>
          </div>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </>
  );
}
