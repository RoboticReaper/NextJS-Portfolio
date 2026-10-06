"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("portfolio-theme", callback);
  return () => window.removeEventListener("portfolio-theme", callback);
};
const snapshot = () => document.documentElement.dataset.theme || "light";
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const theme = useSyncExternalStore(subscribe, snapshot, () => "light");
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("portfolio-theme");
      } catch {}
      if (!saved) {
        document.documentElement.dataset.theme = media.matches
          ? "dark"
          : "light";
        window.dispatchEvent(new Event("portfolio-theme"));
      }
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {}
    window.dispatchEvent(new Event("portfolio-theme"));
  };
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link
          className="brand-logo"
          href="/"
          onClick={() => setOpen(false)}
          aria-label="Baoren Liu home"
        >
          <img src="/logo.svg" alt="Baoren Liu logo" width={36} height={36} />
        </Link>
        <nav
          aria-label="Main navigation"
          className={open ? "main-nav is-open" : "main-nav"}
        >
          {[
            { href: "/projects", label: "Projects" },
            { href: "/about", label: "About" },
            { href: "/resume", label: "Résumé" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
          <a className="nav-contact" href="mailto:liubaoren2006@gmail.com">
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
          <button
            className="menu-button icon-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
