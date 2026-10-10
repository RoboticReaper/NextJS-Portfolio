"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function Breadcrumb() {
  const pathname = usePathname();
  const labels: Record<string, string> = {
    projects: "Projects",
    otherwise: "OtherWise",
    ridelist: "RideList",
    lhsschedule: "LHS Schedule",
    notes: "Notes",
    "coaching-website": "Coaching Website",
    "naive-bayes-spam": "Naive Bayes Spam Detection",
    "fourier-series": "Fourier Series Visualizer",
    ctf: "Capture The Flag",
  };
  const parts = pathname.split("/").filter(Boolean);
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <Link href="/">Home</Link>
      {parts.map((part, index) => (
        <span key={part}>
          <span aria-hidden="true"> / </span>
          <Link
            href={`/${parts.slice(0, index + 1).join("/")}`}
            aria-current={index === parts.length - 1 ? "page" : undefined}
          >
            {labels[part] || part}
          </Link>
        </span>
      ))}
    </nav>
  );
}
