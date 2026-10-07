import Link from "next/link";
import { projects } from "@/config/site";
export function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const external = project.href.startsWith("https:");
  return (
    <article className="project-card">
      <Link
        className={`project-art ${project.tone}`}
        href={project.href}
        aria-label={
          project.title === "LHS Schedule"
            ? "Read the LHS Schedule story"
            : `Explore ${project.title}`
        }
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span className="project-number">0{index + 1}</span>
        {external && <span className="project-launch" aria-hidden="true">↗</span>}
        {project.title === "LHS Schedule" ? (
          <div className="schedule-preview">
            <div className="preview-top">
              <span>
                lhs schedule<span className="accent">.</span>
              </span>
              <span>your day, simplified</span>
            </div>
            <div className="preview-heading">A better school day.</div>
            <img
              src={project.image!}
              alt="LHS Schedule app interface"
              loading="lazy"
            />
          </div>
        ) : project.image ? (
          <div className="notes-preview">
            <img src={project.image} alt="Notes app logo" loading="lazy" />
            <span>
              Make room
              <br />
              for your ideas.
            </span>
          </div>
        ) : project.title.includes("Fourier") ? (
          <div className="fourier-art" aria-hidden="true">
            <div />
            <div />
            <div />
            <span>f(t) = ∑ cₙeⁱⁿᵗ</span>
          </div>
        ) : (
          <div className="type-art" aria-hidden="true">
            {project.title.includes("Bayes") ? "P(A|B)" : project.title}
          </div>
        )}
        <span className="impact-badge">{project.impact}</span>
      </Link>
      <div className="project-copy">
        <p className="eyebrow">{project.category}</p>
        <h3>
          <Link
            href={project.href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {project.title}{external && <> <span aria-hidden="true">↗</span></>}
          </Link>
        </h3>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {!external && (
          <div className="project-links">
            <Link
              className="project-story-link"
              href={project.href}
              aria-label={`Project details for ${project.title}`}
            >
              Project details <span aria-hidden="true">→</span>
            </Link>
            <a
              className="project-live-link"
              href={project.external}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open live app ↗
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
