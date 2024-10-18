import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { Divider } from "@nextui-org/divider";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title({ color: "violet" })}>Baoren Liu</span>
          <div className={subtitle({ class: "mt-4" })}>
            Freshman at Northeastern University, Boston. Currently majoring in Computer Science.
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.about}
          >
            About me
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>

      </section>

      <Divider className="my-4" />

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Project Highlights</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="inline-block max-w-xl text-center justify-center">
            <div className={subtitle({ class: "mt-4" })}>
              LHS Schedule
            </div>
            A square
          </div>
          <div className="inline-block max-w-xl text-center justify-center">
            <div className={subtitle({ class: "mt-4" })}>
              Notes
            </div>
            A circle
          </div>
        </div>
      </section>
    </div>
  );
}
