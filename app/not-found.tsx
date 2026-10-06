import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container page-heading">
      <p className="eyebrow">404 / A wrong turn</p>
      <h1>Nothing here. Yet.</h1>
      <p>Let’s get you back to something useful.</p>
      <Link className="button primary" href="/">
        Back home ↗
      </Link>
    </section>
  );
}
