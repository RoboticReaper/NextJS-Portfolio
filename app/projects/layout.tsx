export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <main className="container mx-auto max-w-7xl px-6 sm:px-10 md:px-24 flex-grow">
        {children}
      </main>
    </section>
  );
}
