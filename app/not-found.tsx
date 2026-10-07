import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container page-heading">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>This page doesn’t exist or may have moved.</p>
      <Link className="button primary" href="/">
        Back home
      </Link>
    </section>
  );
}
