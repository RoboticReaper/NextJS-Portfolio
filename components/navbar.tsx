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
          <span className="logo-mark" aria-hidden="true" />
        </Link>
        <nav
          aria-label="Main navigation"
          className={open ? "main-nav is-open" : "main-nav"}
        >
          {[
            { href: "/", label: "Home" },
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
          <button
            className="menu-button icon-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d={open ? "M6 6L18 18M18 6L6 18" : "M4 6H20M4 12H20M4 18H20"} />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
