import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import resume from "@/lib/generated/resume-overlay.json";

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
            Open PDF
          </a>
        </div>
      </header>
      <section className="resume-document" aria-label="Résumé document">
        <div className="resume-preview">
          <Image
            src="/resume.svg"
            alt="Baoren Liu résumé"
            width={resume.width}
            height={resume.height}
            draggable={false}
            unoptimized
            priority
          />
          <svg
            className="resume-overlay"
            viewBox={`0 0 ${resume.width} ${resume.height}`}
            role="group"
            aria-label="Selectable résumé text and links"
          >
            <g className="resume-text-layer" xmlSpace="preserve">
              {resume.lines.map((line, index) => (
                <text key={index}>
                  {line.map((run, runIndex) => (
                    <tspan
                      key={runIndex}
                      x={run.x}
                      y={run.y}
                      fontSize={run.size}
                      fontWeight={run.bold ? "bold" : "normal"}
                      fontStyle={run.italic ? "italic" : "normal"}
                      textLength={run.width}
                      lengthAdjust="spacingAndGlyphs"
                    >
                      {run.text}
                    </tspan>
                  ))}
                </text>
              ))}
            </g>
            <g className="resume-link-layer">
              {resume.links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <rect x={link.x} y={link.y} width={link.width} height={link.height} />
                </a>
              ))}
            </g>
          </svg>
        </div>
      </section>
    </div>
  );
}
