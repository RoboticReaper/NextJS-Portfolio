import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Résumé" };

export default function ResumePage() {
  return (
    <div className="container page-container resume-page">
      <header className="page-heading">
        <h1>Résumé</h1>
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
      <section className="resume-document" aria-label="Résumé document">
        <Image
          src="/resume.svg"
          alt="Baoren Liu résumé"
          width={612}
          height={792}
          unoptimized
          priority
        />
      </section>
    </div>
  );
}
