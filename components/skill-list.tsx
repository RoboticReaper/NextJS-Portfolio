import { skills } from "@/config/site";

const icons: Record<(typeof skills)[number], string> = {
  Python: "/python logo.png",
  Java: "/java logo.svg",
  "C++": "/cpp logo.svg",
  SQL: "/skills/sql.svg",
  TypeScript: "/typescript.svg",
  React: "/react logo.webp",
  "Next.js": "/next.svg",
  Flask: "/skills/flask.svg",
  PyTorch: "/skills/pytorch.svg",
  PostgreSQL: "/skills/postgresql.svg",
  Docker: "/skills/docker.svg",
  Git: "/skills/git.svg",
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
