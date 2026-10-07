"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container page-heading">
      <p className="eyebrow">Page error</p>
      <h1>Something went wrong</h1>
      <p>This page couldn’t load. Please try again.</p>
      <button className="button primary" onClick={reset}>
        Try again ↻
      </button>
    </section>
  );
}
