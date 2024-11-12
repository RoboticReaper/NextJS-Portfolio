
import { Image } from "@nextui-org/image";

export default function Skills() {
    const languages = [
        {
          language: "Python",
          img: "python logo.png"
        },
        {
          language: "Java",
          img: "java logo.svg"
        },
        {
          language: "C++",
          img: "cpp logo.svg"
        },
        {
          language: "Kotlin",
          img: "kotlin logo.png"
        },
        {
          language: "HTML, CSS, JavaScript",
          img: "js logo.png"
        },
        {
          language: "ReactJS",
          img: "react logo.webp"
        },
        {
          language: "Firebase",
          img: "firebase logo.png"
        }
      ]

    return (
        <div className="flex flex-wrap justify-center gap-2">
          {languages.map((item) => {
            return <div className="inline-block max-w-md text-center justify-center p-4" key={item.language}>
              <div className="text-base text-center justify-center">
                {item.language}
              </div>
              <div className="inline-block m-2">
                <Image
                  width={100}
                  height={100}
                  loading="lazy"
                  alt={"Logo of " + item.language}
                  src={item.img} />
              </div>
            </div>
          })}
        </div>
    )
}