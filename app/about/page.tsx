'use client'
import { title, subtitle } from "@/components/primitives";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { siteConfig } from "@/config/site";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/card";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button } from "@nextui-org/button";
import { useEffect } from "react";

export default function AboutPage() {

  useEffect(()=>{
    fetch('/api/coc').then(res => res.json()).then(data => console.log(data))
  },[])


  return (
    <div>
      <h1 className={title()}>About</h1>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <main className="container mx-auto max-w-7xl px-6 sm:px-10 md:px-24 flex-grow">
          <div className="flex flex-col lg:flex-row items-center gap-6 justify-center lg:items-start">
            <div><Image src="Baoren Liu Portrait.jpg" width={200} alt="My portrait" /></div>
            <div className="w-full lg:w-2/3 text-left text-base">
              I am Baoren Liu, a freshman at <span className="text-red-400">Northeastern University</span>, Boston, currently majoring in <span className="text-red-400">Computer Science</span>.
              I have been coding for {new Date().getFullYear() - new Date(2018, 0, 1).getFullYear()}~ years, and I enjoy making programs to solve random problems.
              <br /><br />
              My current goal is to learn more AI algorithms and do some projects related to them.
              I am looking forward to Northeastern's co-op program and explore which branch of computer science I like the most.
              <br /><br />
              I have written details on some of my proudest projects, so you can read about them on my <Link href={siteConfig.links.projects}>projects page</Link>.
              Feel free to explore other projects on my <Link href={siteConfig.links.github} isExternal>GitHub</Link> as well.
            </div>
          </div>
          <div className="text-left text-base w-full mt-10 lg:px-12 xl:px-16">
            <h2 className={subtitle()}>Related Experience</h2>
            <ul className="list-disc list-outside grid gap-2">
              <li>Leader for many projects in the <Link href="https://lexyouthstem.org/" isExternal>Lexington Youth STEAM Team</Link> from 2020 to 2024,
                and volunteered nearly 400 hours on projects like website development, data analysis, and event organization to create impact on the community.</li>
              <li>Interned at <Link href="https://www.massgeneralbrigham.org/en/about/careers/working-here-assembly-row" isExternal>Mass General Brigham</Link> to
                work on utilizing Electronic Health Record data (MIMIC-IV) and Retrieval Augmented Generation with Generative AI to help diagnose patients based on structured and unstructured data.</li>
              <li>Researching with <Link href="https://www.massgeneral.org/" isExternal>Mass General Hospital</Link> to quantify pain measurements scientifically</li>
              <li>Teaching assistant at <Link href="https://www.ktbyte.com/" isExternal>KTByte</Link> from 2021 to 2023. Helped students with Java and Processing homeworks during office hour.</li>

            </ul>
          </div>
          <Link
            className={`${buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })} m-8`}
            href={siteConfig.links.resume}
            isExternal
          >
            View Resume
          </Link>
          {/* <Button onClick={runDB}>DB</Button> */}
          <div className="text-left text-base w-full mt-10 lg:px-12 xl:px-16">
            <h2 className={subtitle()}>Hobbies</h2>
            <div className="flex w-full flex-col">
              <Tabs aria-label="Options">
                <Tab key="sports" title="Sports">
                  <Card>
                    <CardBody>
                      I like to play tennis. 
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="games" title="Video Games">
                  <Card>
                    <CardBody>
                      Rocket League, PUBG, Genshin Impact.

                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="music" title="Musics">
                  <Card>
                    <CardBody>
                      I listen to these musics.
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
