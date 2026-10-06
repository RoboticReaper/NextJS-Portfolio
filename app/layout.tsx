import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/navbar";
import { NameIntro } from "@/components/intro";
import { siteConfig } from "@/config/site";
export const metadata: Metadata = {
  metadataBase: new URL("https://baorenliu.com"),
  title: { default: siteConfig.name, template: "%s — Baoren Liu" },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "https://baorenliu.com",
    type: "website",
    images: [{ url: "/Baoren Liu Portrait.jpg" }],
  },
  icons: { icon: "/favicon.ico" },
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#111714" },
  ],
};
const initialize = `(function(){var h=document.documentElement;var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;try{var t=localStorage.getItem('portfolio-theme');h.dataset.theme=t==='dark'||t==='light'?t:(dark?'dark':'light')}catch(e){h.dataset.theme=dark?'dark':'light'}if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){h.dataset.introPending='true';window.setTimeout(function(){delete h.dataset.introPending;var c=document.getElementById('site-content');if(c)c.inert=false},3000)}})();`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initialize }} />
      </head>
      <body>
        <NameIntro />
        <div id="site-content">
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <footer className="site-footer">
            <div className="container footer-inner">
              <Link className="wordmark" href="/">
                bl<span className="accent">.</span>
              </Link>
              <p>
                Made with curiosity. © {new Date().getFullYear()} Baoren Liu.
              </p>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </footer>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
