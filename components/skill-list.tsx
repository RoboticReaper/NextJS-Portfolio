import { skills } from "@/config/site";

const icons: Record<(typeof skills)[number], string> = {
  Python: "/python logo.png",
  Java: "/java logo.svg",
  "C++": "/cpp logo.svg",
  Kotlin: "/kotlin logo.png",
  JavaScript: "/js logo.png",
  TypeScript: "/typescript.svg",
  React: "/react logo.webp",
  "Next.js": "/next.svg",
  Firebase: "/firebase logo.png",
  MySQL: "/mysql.png",
};

export function SkillList() {
  return (
    <ul className="skill-list" aria-label="Skills">
      {skills.map((skill) => (
        <li key={skill}>
          <img
            src={icons[skill]}
            alt=""
            width={28}
            height={28}
            loading="lazy"
          />
          {skill}
        </li>
      ))}
    </ul>
  );
}
