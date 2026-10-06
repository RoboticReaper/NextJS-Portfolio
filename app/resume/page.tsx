import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  award,
  education,
  technicalSkills,
  workExperience,
} from "@/config/profile";

export const metadata: Metadata = { title: "Résumé" };

export default function ResumePage() {
  return (
    <div className="container page-container">
      <header className="page-heading">
        <p className="eyebrow">Education and experience</p>
        <h1>Résumé</h1>
        <p>
          My background in software engineering, mathematics, AI, and robotics.
        </p>
        <div className="resume-actions">
          <a className="button primary" href={siteConfig.links.resume} download>
            Download PDF <span aria-hidden="true">↓</span>
          </a>
          <a
            className="button secondary"
            href={siteConfig.links.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open PDF <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
      <section className="resume-summary" aria-labelledby="resume-education">
        <h2 id="resume-education">Education</h2>
        <p>
          {education.degree} at {education.university}. Expected graduation:{" "}
          {education.graduation}. GPA: {education.gpa}.
        </p>
        <p>
          {education.activity}. Coursework: {education.coursework}.
        </p>
        <h2>Experience</h2>
        <div className="overview-grid">
          {workExperience.map((item) => (
            <article className="overview-card" key={item.organization}>
              <h3>{item.organization}</h3>
              <p className="overview-role">{item.role}</p>
              <p className="eyebrow">{item.date}</p>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
        <h2 className="resume-subheading" id="technical-skills">
          Technical skills
        </h2>
        <dl className="technical-skills">
          {Object.entries(technicalSkills).map(([group, values]) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd>{values.join(", ")}</dd>
            </div>
          ))}
        </dl>
        <h2 className="resume-subheading">Awards</h2>
        <p>{award}</p>
      </section>
      <section className="resume-document" aria-label="Résumé document">
        <iframe
          src={`${encodeURI(siteConfig.links.resume)}#view=FitH`}
          title="Baoren Liu résumé PDF"
          loading="lazy"
        />
        <p>
          If the preview doesn’t load, use the Open PDF or Download PDF links
          above.
        </p>
      </section>
    </div>
  );
}
