import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Divider } from "@heroui/divider";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import {
  GithubIcon,
  DiscordIcon,
  InstagramIcon
} from "@/components/icons";
import { Image } from "@heroui/image";
import Skills from "@/components/skills";

export default function Home() {

  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block">
          <Image src="Baoren Liu Portrait.jpg" height={300} alt="My portrait" />
        </div>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="inline-block max-w-md text-center justify-center p-4">
            <div className={subtitle({ class: "mt-4" })}>
              {siteConfig.links.projectLinks.find(item => item.id === 0)?.label}
            </div>
            <div className="inline-block m-2">
              <Link href={siteConfig.links.projectLinks.find(item => item.id === 0)?.href}>
                <Image
                  width={250}
                  height={250}
                  isZoomed
                  loading="lazy"
                  alt="Logo of LHS Schedule"
                  src="LHS Schedule.png" />
              </Link>
            </div>
            <div className="text-base text-center justify-center">
              A popular web app built for managing my high school's weird schedule that repeats every 6 working days. More than <span className="text-red-400">1300 users</span> currently.
            </div>
          </div>
          <div className="inline-block max-w-md text-center justify-center p-4">
            <div className={subtitle({ class: "mt-4" })}>
              {siteConfig.links.projectLinks.find(item => item.id === 1)?.label}
            </div>
            <div className="inline-block m-2">
              <Link href={siteConfig.links.projectLinks.find(item => item.id === 1)?.href}>
                <Image
                  width={250}
                  height={250}
                  isZoomed
                  loading="lazy"
                  alt="Logo of Notes"
                  src="Notes.jpg" />
              </Link>
            </div>
            <div className="text-base text-center justify-center">
              A native Android app for taking notes. Distributed on various popular third-party app stores with <span className="text-red-400">7k+ downloads</span>.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.projects}
          >
            More projects
          </Link>
        </div>
      </section>

      <Divider className="my-4" />

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Skills</span>
        </div>

        <Skills alignment="center" />
      </section>

      <Divider className="my-4" />

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 mb-16">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()} id="contacts">Contacts</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Link isExternal aria-label="Instagram" href={siteConfig.links.instagram}>
            <InstagramIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          Email: <Link href="mailto:liubaoren2006@gmail.com" isExternal>liubaoren2006@gmail.com</Link>
        </div>
      </section>
    </div>
  );
}
