"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container page-heading">
      <p className="eyebrow">A small hiccup</p>
      <h1>Let’s try that again.</h1>
      <p>Something interrupted this page.</p>
      <button className="button primary" onClick={reset}>
        Try again ↻
      </button>
    </section>
  );
}
