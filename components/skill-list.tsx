import { featuredSkills } from "@/config/featured-skills";

export function SkillList() {
  return (
    <div className="skill-groups">
      {Object.entries(featuredSkills).map(([category, skills]) => (
        <div className="skill-group" key={category}>
          <h3>{category}</h3>
          <ul className="skill-list" aria-label={category}>
            {skills.map((skill) => (
              <li key={skill.name} title={skill.name}>
                <img src={skill.icon} alt="" width={22} height={22} loading="lazy" />
                {"label" in skill ? skill.label : skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
