import type { technicalSkills } from "@/config/profile";

type FeaturedSkill<Name extends string> = {
  name: Name;
  icon: string;
  label?: string;
};

// Keep homepage highlights grounded in the complete, resume-backed skill list.
type FeaturedSkills = {
  [Category in keyof typeof technicalSkills]: readonly FeaturedSkill<
    (typeof technicalSkills)[Category][number]
  >[];
};

export const featuredSkills = {
  Languages: [
    { name: "Python", icon: "/python logo.png" },
    { name: "TypeScript", icon: "/typescript.svg" },
    { name: "JavaScript", icon: "/js logo.png" },
    { name: "Java", icon: "/skills/java.svg" },
    { name: "C++", icon: "/cpp logo.svg" },
    { name: "SQL", icon: "/skills/sql.svg" },
  ],
  Technologies: [
    { name: "React", icon: "/react logo.webp" },
    { name: "Next.js", icon: "/skills/nextjs.svg" },
    { name: "FastAPI", icon: "/skills/fastapi.svg" },
    { name: "Flask", icon: "/skills/flask.svg" },
  ],
  "AI & data": [
    { name: "PyTorch", icon: "/skills/pytorch.svg" },
    { name: "LangChain", icon: "/skills/langchain.svg" },
    { name: "LangGraph", icon: "/skills/langgraph.svg" },
    { name: "Hugging Face", icon: "/skills/huggingface.svg" },
  ],
  Databases: [
    { name: "PostgreSQL", icon: "/skills/postgresql.svg" },
    { name: "pgvector", icon: "/skills/vector.svg" },
    { name: "PostGIS", icon: "/skills/map.svg" },
  ],
  "Cloud & platforms": [
    { name: "Docker", icon: "/skills/docker.svg" },
    { name: "Google Cloud", icon: "/skills/googlecloud.svg" },
    { name: "Microsoft Azure", icon: "/skills/azure.svg" },
    { name: "Firebase", icon: "/skills/firebase.svg" },
  ],
  "Developer tools": [
    { name: "Git", icon: "/skills/git.svg" },
    { name: "GitLab CI/CD", icon: "/skills/gitlab.svg" },
    { name: "Codex", icon: "/skills/codex.svg" },
  ],
  "Systems & automation": [
    { name: "SSH", icon: "/skills/terminal.svg" },
    { name: "Webhooks", icon: "/skills/webhook.svg" },
    { name: "cron", icon: "/skills/clock.svg" },
  ],
  Methods: [
    { name: "Retrieval-augmented generation (RAG)", label: "RAG", icon: "/skills/retrieval.svg" },
    { name: "Prompt engineering", icon: "/skills/prompt.svg" },
  ],
} satisfies FeaturedSkills;
