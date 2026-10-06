import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { researchExperience, workExperience } from "@/config/profile";

export const metadata: Metadata = { title: "Résumé" };

export default function ResumePage() {
  return (
    <div className="container page-container">
      <header className="page-heading">
        <p className="eyebrow">Education and experience</p>
        <h1>Résumé</h1>
        <p>
          My background in computer science, mathematics, research, and
          teaching.
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
          Computer Science + Mathematics at the University of Illinois
          Urbana-Champaign. Previously studied at Northeastern University.
        </p>
        <h2>Experience</h2>
        <div className="overview-grid">
          {[...researchExperience, ...workExperience].map((item) => (
            <article className="overview-card" key={item.organization}>
              <h3>{item.organization}</h3>
              <p className="overview-role">{item.role}</p>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
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
