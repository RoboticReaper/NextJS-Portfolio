import type { Metadata } from "next";
import Link from "next/link";
import { LiveInterests } from "@/components/live-interests";
import { siteConfig } from "@/config/site";
import { education, earlierExperience, workExperience } from "@/config/profile";
import { SkillList } from "@/components/skill-list";
export const metadata: Metadata = { title: "About" };
const experience = [...workExperience, ...earlierExperience];
export default function AboutPage() {
  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">Background and interests</p>
        <h1>About me</h1>
        <p>Computer Science + Mathematics student at UIUC.</p>
      </header>
      <section className="about-intro">
        <div className="about-profile-card">
          <span className="logo-mark" aria-hidden="true" />
          <p className="eyebrow">At a glance</p>
          <h2>Hi, I’m Baoren.</h2>
          <p>CS + Mathematics at UIUC</p>
          <p>Software, AI, and infrastructure</p>
          <a
            className="text-link"
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
        </div>
        <div>
          <h2>Education and interests</h2>
          <p>
            I’m studying Computer Science + Mathematics at the University of
            Illinois Urbana-Champaign, after transferring from Northeastern
            University. I expect to graduate in {education.graduation}.
          </p>
          <p>
            I’ve been coding since 2018. I enjoy making programs to solve
            everyday problems. I’m interested in how systems work, from
            databases to secure networked applications, alongside AI and
            robotics research. I work as a software engineer in NOBE’s
            Technology Division at UIUC.
          </p>
          <p>
            I’m looking for summer internships and exploring the areas of
            computer science that interest me most. You can read about some of
            my work on the{" "}
            <Link className="inline-link" href="/projects">
              projects page
            </Link>
            .
          </p>
          <a
            className="button primary"
            href={siteConfig.links.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            View my résumé ↗
          </a>
        </div>
      </section>
      <section className="experience-section" id="research">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Research, teaching, and volunteering</p>
            <h2>Experience</h2>
          </div>
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-row" key={item.organization}>
              <span className="eyebrow">{item.date}</span>
              <div>
                <h3>{item.role}</h3>
                <a
                  className="inline-link"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.organization} ↗
                </a>
                <p>{item.detail}</p>
                {item.publication && (
                  <p>
                    <a
                      className="inline-link"
                      href={item.publication.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Research preprint ↗
                    </a>{" "}
                    · {item.publication.status}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section about-skills">
        <p className="eyebrow">Programming</p>
        <h2>Tools and languages</h2>
        <SkillList />
      </section>
      <section className="personal-section" id="hobbies">
        <p className="eyebrow">Beyond the keyboard</p>
        <h2>Outside of school</h2>
        <p className="section-description">
          I also enjoy playing games and listening to music.
        </p>
        <LiveInterests />
        <div className="other-interests">
          <p>
            <strong>Asphalt Legends Unite</strong> Reputation level 100 · Garage
            level 22 · Ex-Legions United
          </p>
          <p>
            <strong>Genshin Impact</strong> Adventure rank 59 · Playing since
            version 1.0
          </p>
        </div>
      </section>
    </>
  );
}
