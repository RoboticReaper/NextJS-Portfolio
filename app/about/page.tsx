'use client'
import { title, subtitle } from "@/components/primitives";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { siteConfig } from "@/config/site";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { button as buttonStyles } from "@heroui/theme";
import { Skeleton, Button } from "@heroui/react";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [cocLoaded, setCocLoaded] = useState(false);
  const [spotifyLoaded, setSpotifyLoaded] = useState(false);

  interface CocData {
    playername: string;
    townhall: number;
    trophies: number;
    leagueicon: string;
    league: string;
  }

  const [cocData, setCocData] = useState<CocData | null>(null);
  const [spotifyData, setSpotifyData] = useState<any | null>(null);

  useEffect(() => {
    fetch(`/api/coc?timestamp=${Date.now()}`).then(res => res.json()).then((data) => {
      if (data.league === undefined) {
        data.league = {
          name: "Unranked",
          iconUrls: {
            small: "coc_unranked.png"
          }
        }
      }

      // add cocData
      setCocData({
        playername: data.name,
        townhall: data.townHallLevel,
        trophies: data.trophies,
        leagueicon: data.league.iconUrls.small,
        league: data.league.name
      })
      setCocLoaded(true)
    });

    fetch('/api/spotify').then(res => res.json()).then((data) => {
      setSpotifyData(data.rows)
      setSpotifyLoaded(true)
    })
  }, [])


  return (
    <div>
      <h1 className={title()}>About</h1>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <main className="container mx-auto max-w-7xl px-6 sm:px-10 md:px-24 flex-grow">
          <div className="flex flex-col lg:flex-row items-center gap-6 justify-center lg:items-start">
            <div><Image src="Baoren Liu Portrait.jpg" width={200} alt="My portrait" /></div>
            <div className="w-full lg:w-2/3 text-left text-base">
              I am Baoren Liu, a sophomore at <span className="text-red-400">UIUC</span> after transferring from Northeastern University. I'm currently majoring in <span className="text-red-400">Computer Science + Math</span>.
              I have been coding for {new Date().getFullYear() - new Date(2018, 0, 1).getFullYear()}~ years, and I enjoy making programs to solve random problems.
              <br /><br />
              My current goal is to learn more AI algorithms and do some projects related to them.
              I am looking forward to UIUC's co-op program and explore which branch of computer science I like the most.
              <br /><br />
              I have written details on some of my proudest projects, so you can read about them on my <Link href={siteConfig.links.projects}>projects page</Link>.
              Feel free to explore other projects on my <Link href={siteConfig.links.github} isExternal>GitHub</Link> as well.
            </div>
          </div>
          <div className="text-left text-base w-full mt-10 lg:px-12 xl:px-16">
            <h2 className={subtitle()}>Related Experience</h2>
            <ul className="list-disc list-outside grid gap-2">
              <li>Leader for many projects in the <Link href="https://youthsteaminitiative.org/" isExternal>Lexington Youth STEAM Team</Link> from 2020 to 2024,
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
                <Tab key="games" title="Video Games">
                  <Card>
                    <CardBody>
                      <div className="flex flex-row gap-3 justify-center flex-wrap">
                        <Card className="w-48 space-y-4 p-4" radius="lg">
                          <Image isLoading={!cocLoaded} src="cocIcon.jpg" alt="CoC icon" />
                          <div className="pb-4">
                            {!cocData ? <Skeleton isLoaded={cocLoaded} className="w-full rounded-lg mb-2"></Skeleton> :
                              <div>
                                <div className="text-sm text-center mb-2">Clash of Clans</div>
                                <div className="w-full rounded-lg text-sm">Name: {cocData.playername}</div>
                                <div className="w-full rounded-lg text-sm">TH Level: {cocData.townhall}</div>
                                <div className="w-full rounded-lg text-sm">Trophies: {cocData.trophies}</div>
                                <div className="flex flex-col items-center">
                                  <Image src={cocData.leagueicon} width={50} alt="League icon" />
                                  <div className="w-full rounded-lg text-sm text-center">{cocData.league}</div>
                                </div>
                              </div>
                            }
                          </div>
                        </Card>
                        <Card className="w-48 space-y-4 p-4" radius="lg">
                          <Image src="A9 icon.jpg" alt="Asphalt icon" />
                          <div className="pb-4">
                            <div>
                              <div className="text-sm text-center mb-2">Asphalt Legends Unite</div>
                              <div className="w-full rounded-lg text-sm">Reputation Level: 100</div>
                              <div className="w-full rounded-lg text-sm">Garage Level: 20</div>
                              <div className="flex flex-col items-center">
                                <Image src="legions.png" width={50} alt="Asphalt 9 club icon" />
                                <div className="w-full rounded-lg text-sm text-center">Ex-Legions United Club</div>
                              </div>
                            </div>
                          </div>
                        </Card>
                        <Card className="w-48 space-y-4 p-4" radius="lg">
                          <Image src="genshin.webp" alt="genshin impact icon" />
                          <div className="pb-4">
                            <div>
                              <div className="text-sm text-center mb-2">Genshin Impact</div>
                              <div className="w-full rounded-lg text-sm">Adventure Rank: 59</div>
                              <div className="w-full rounded-lg text-sm">Joined since version 1.0</div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="music" title="Musics">
                  <Card>
                    <CardBody>
                      <div className="text-center text-md mb-2">My top musics this week on Spotify.</div>
                      <div className="flex flex-row gap-3 justify-center flex-wrap">
                        {spotifyData?.map((song: any, index: number) => (
                          <Card key={index} className="w-48 space-y-4 p-4" radius="lg">
                            <Link isExternal href={song.link}><Image src={song.image} alt="Song icon" /></Link>
                            <div>
                              <div className="text-sm text-center">{song.name}</div>
                              <div className="text-sm text-center text-gray-500">{song.artist}</div>
                            </div>
                          </Card>
                        ))}
                      </div>
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
