import type { Metadata } from "next";
import Link from "next/link";
import { LiveInterests } from "@/components/live-interests";
import { siteConfig, skills } from "@/config/site";
export const metadata: Metadata = { title: "About" };
const experience = [
  {
    date: "Healthcare × AI",
    role: "Research & engineering",
    organization: "Mass General Brigham",
    detail:
      "Worked with electronic health records, retrieval augmented generation, and generative AI to support diagnosis using structured and unstructured data. Research paper co-author.",
    href: "https://www.massgeneralbrigham.org/",
  },
  {
    date: "Scientific research",
    role: "Making pain measurable",
    organization: "Mass General Hospital",
    detail: "Research into scientifically quantifying pain measurements.",
    href: "https://www.massgeneral.org/",
  },
  {
    date: "2020 — 2024",
    role: "Community project leadership",
    organization: "Lexington Youth STEAM Team",
    detail:
      "Led website development, data analysis, and event organization projects. Volunteered nearly 400 hours to create impact in the community.",
    href: "https://youthsteaminitiative.org/",
  },
  {
    date: "2021 — 2023",
    role: "Teaching assistant",
    organization: "KTByte",
    detail:
      "Helped students with Java and Processing assignments during office hours, making tricky concepts a little more approachable.",
    href: "https://www.ktbyte.com/",
  },
];
export default function AboutPage() {
  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">A little more human</p>
        <h1>Curiosity, meet code.</h1>
        <p>Developer. Math enthusiast. Perpetual work in progress.</p>
      </header>
      <section className="about-intro">
        <div className="about-portrait">
          <img
            src="/Baoren Liu Portrait.jpg"
            alt="Baoren Liu"
            width={480}
            height={687}
          />
          <span>Hi, I’m Baoren.</span>
        </div>
        <div>
          <h2>
            I like figuring
            <br />
            things out.
          </h2>
          <p>
            I’m studying Computer Science + Mathematics at the University of
            Illinois Urbana-Champaign, after transferring from Northeastern
            University.
          </p>
          <p>
            I’ve been coding since 2018. I enjoy making programs to solve
            everyday problems, exploring AI algorithms, and finding new ways to
            connect mathematics with software.
          </p>
          <p>
            I’m looking for summer internships and exploring the areas of
            computer science that excite me most. You can read about my proudest
            work on the{" "}
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
      <section className="experience-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Where I’ve contributed</p>
            <h2>Learning by doing.</h2>
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
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section about-skills">
        <p className="eyebrow">Always adding to the toolkit</p>
        <h2>What I work with.</h2>
        <div className="skill-list">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
      <section className="personal-section">
        <p className="eyebrow">Beyond the keyboard</p>
        <h2>A few things I’m into.</h2>
        <p className="section-description">
          There’s more to life than a good commit. Here’s a small window into
          mine.
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
