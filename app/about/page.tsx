import { title } from "@/components/primitives";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";

export default function AboutPage() {
  return (
    <div>
      <h1 className={title()}>About</h1>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <main className="container mx-auto max-w-7xl px-6 sm:px-10 md:px-24 flex-grow">
          <div className="flex flex-col lg:flex-row items-center gap-6 justify-center lg:items-start">
            <div><Image src="Baoren Liu Portrait.jpg" width={200} alt="My portrait"/></div>
            <div className="w-full lg:w-2/3 text-left">
              I am Baoren Liu, a freshman at <span className="text-red-400">Northeastern University</span>, Boston, currently majoring in <span className="text-blue-400">Computer Science</span>.
              I enjoy making programs to solve random problems.
              <br /><br />
              My current goal is to learn more AI algorithms and do some projects related to them.
              I am looking forward to Northeastern's co-op program and explore which branch of computer science I like the most.
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
