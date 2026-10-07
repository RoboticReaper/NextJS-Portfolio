"use client";
import { useEffect, useRef } from "react";

export function NameIntro() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let returning = false;
    try {
      returning = localStorage.getItem("baoren-visited") === "yes";
      localStorage.setItem("baoren-visited", "yes");
    } catch {}
    element.dataset.visit = returning ? "return" : "first";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const content = document.getElementById("site-content");
    if (content) content.inert = true;
    element.classList.add("intro-active");
    const finish = () => {
      element.classList.remove("intro-active");
      delete document.documentElement.dataset.introPending;
      if (content) content.inert = false;
    };
    const timer = window.setTimeout(finish, returning ? 250 : 1800);
    return () => {
      window.clearTimeout(timer);
      finish();
    };
  }, []);
  return (
    <div
      ref={ref}
      className="name-intro"
      data-testid="name-intro"
      aria-hidden="true"
    >
      <div className="intro-grid" />
      <div className="intro-type">
        <span className="intro-caption">Personal website</span>
        <div className="intro-name">
          {"Baoren Liu".split("").map((letter, i) => (
            <span key={i} style={{ "--letter": i } as React.CSSProperties}>
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
          <span className="intro-dot">.</span>
        </div>
        <div className="intro-line" />
        <span className="intro-caption">Welcome</span>
      </div>
    </div>
  );
}
