import type { Metadata } from "next";
import Link from "next/link";
import { LiveInterests } from "@/components/live-interests";
import { siteConfig } from "@/config/site";
import { award, education, earlierExperience, technicalSkills, workExperience } from "@/config/profile";
export const metadata: Metadata = { title: "About" };
const experience = [...workExperience, ...earlierExperience];
export default function AboutPage() {
  return (
    <div className="about-page dense-page">
      <header className="page-heading">
        <p className="eyebrow">Background and interests</p>
        <h1>About me</h1>
        <p>Computer Science + Mathematics student at UIUC.</p>
      </header>
      <section className="about-intro">
        <div className="about-profile-card about-education">
          <span className="logo-mark" aria-hidden="true" />
          <h2>Education</h2>
          <p className="education-university">{education.university}</p>
          <p>{education.degree}</p>
          <p>Expected {education.graduation} · GPA {education.gpa}</p>
          <p className="education-coursework"><strong>Coursework</strong><br />{education.coursework}</p>
          <div className="about-profile-links">
            <a className="inline-link" href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <Link className="inline-link" href="/resume">Résumé</Link>
          </div>
        </div>
        <div className="about-background">
          <h2>Background</h2>
          <p>
            I transferred to UIUC from Northeastern University and have been
            coding since 2018. I enjoy making programs to solve
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
          <p>
            Two recent projects are{" "}
            <Link className="inline-link" href="/projects/otherwise">
              OtherWise
            </Link>,
            a topic discovery tool, and{" "}
            <Link className="inline-link" href="/projects/ridelist">
              RideList
            </Link>,
            a campus ridesharing app.
          </p>
        </div>
      </section>
      <section className="experience-section">
        <div className="section-heading" id="research">
          <div>
            <p className="eyebrow">Research, teaching, and volunteering</p>
            <h2>Experience</h2>
          </div>
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-row" key={item.organization}>
              <span className="eyebrow">{item.date}</span>
              <div id={item.id}>
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
        <p className="eyebrow" id="tools">Programming</p>
        <h2 id="technical-skills">Tools and languages</h2>
        <dl className="technical-skills">
          {Object.entries(technicalSkills).map(([group, values]) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd>{values.join(", ")}</dd>
            </div>
          ))}
        </dl>
        <div className="about-awards" id="awards">
          <h3>Awards</h3>
          <p>{award}</p>
        </div>
      </section>
      <section className="personal-section">
        <p className="eyebrow" id="hobbies">Beyond the keyboard</p>
        <h2>Outside of school</h2>
        <p className="section-description">
          I also enjoy playing games and listening to music.
        </p>
        <LiveInterests>
          <div className="other-interests">
            <article className="game-interest" aria-labelledby="asphalt-heading">
              <img src="/A9%20icon.jpg" alt="" width={64} height={64} loading="lazy" />
              <div>
                <h3 id="asphalt-heading">Asphalt Legends Unite</h3>
                <p>Reputation level 100 · Garage level 22</p>
                <p>Ex-Legions United</p>
              </div>
            </article>
            <article className="game-interest" aria-labelledby="genshin-heading">
              <img src="/genshin.webp" alt="" width={64} height={64} loading="lazy" />
              <div>
                <h3 id="genshin-heading">Genshin Impact</h3>
                <p>Adventure rank 59</p>
                <p>Playing since version 1.0</p>
              </div>
            </article>
          </div>
        </LiveInterests>
      </section>
    </div>
  );
}
