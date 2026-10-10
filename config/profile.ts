type Experience = {
  id?: string;
  date: string;
  role: string;
  organization: string;
  summary: string;
  detail: string;
  href: string;
  publication?: { title: string; href: string; status: string };
};
export const education = {
  university: "University of Illinois Urbana-Champaign",
  degree: "Bachelor of Science in Mathematics & Computer Science",
  graduation: "May 2028",
  gpa: "3.92",
  activity: "Software engineering in NOBE’s Technology Division",
  coursework:
    "Data Structures & Algorithms, Database Systems, Linear Algebra, Probability & Statistics",
};
export const workExperience: Experience[] = [
  {
    id: "hcesc-xr",
    date: "July 2026 — Present",
    role: "Undergraduate Student Researcher",
    organization: "HCESC-XR Lab, UIUC",
    summary:
      "Building Python simulation environments and an Isaac Sim benchmark for AI agents.",
    detail:
      "Developing an Isaac Sim benchmark for agents that diagnose hidden physical failures and recover from manipulation errors. Building Python environments with sensor feedback, inverse-kinematics control, and an observation-action API for LLM, VLA, and reinforcement learning agents.",
    href: "https://rehg.org/",
  },
  {
    id: "mass-general-brigham",
    date: "June 2024 — Present",
    role: "AI Research Intern",
    organization: "Mass General Brigham",
    summary:
      "Working on clinical retrieval augmented generation, multi-agent support tools, and deployment automation.",
    detail:
      "Built a retrieval augmented generation pipeline for clinical evidence in a HIPAA-compliant environment. Compared it with traditional machine learning models using cross-validation and bootstrapping, co-authored a dementia-identification paper, and built a LangGraph hospital support prototype. Automated the research website’s deployment with GitLab CI/CD, webhooks, and SSH-managed Linux runners.",
    href: "https://wangaihealthlab.bwh.harvard.edu/",
    publication: {
      title: "Dementia identification with retrieval augmented generation",
      href: "https://pubmed.ncbi.nlm.nih.gov/41646828/",
      status: "Under peer review at the Journal of Biomedical Informatics",
    },
  },
  {
    id: "nobe",
    date: "September 2026 — Present",
    role: "Software Engineer",
    organization: "NOBE, Illinois Chapter",
    summary:
      "Software engineering in UIUC’s National Organization for Business and Engineering Technology Division.",
    detail:
      "Working as a software engineer in the Technology Division of UIUC’s National Organization for Business and Engineering chapter.",
    href: "https://www.nobeillinois.org/",
  },
];
export const earlierExperience: Experience[] = [
  {
    date: "Scientific research",
    role: "Pain measurement research",
    organization: "Mass General Hospital",
    summary: "Research into scientifically quantifying pain measurements.",
    detail: "Research into scientifically quantifying pain measurements.",
    href: "https://www.massgeneral.org/",
  },
  {
    date: "September 2020 — May 2024",
    role: "Founder, Project Leader & Technical Lead",
    organization: "Lexington Youth STEAM Team",
    summary:
      "Website development, data analysis, and event organization for community projects.",
    detail:
      "Partnered with local municipal committees on a virtual Patriots’ Day event platform, analyzed historical grant trends for the Community Endowment of Lexington, and maintained the organization’s website. Led volunteer recruitment and onboarding.",
    href: "https://youthsteaminitiative.org/",
  },
  {
    date: "September 2021 — May 2023",
    role: "Teaching assistant",
    organization: "KTByte",
    summary:
      "Helped students with Java and Processing assignments during office hours.",
    detail:
      "Helped students with Java and Processing assignments during office hours.",
    href: "https://www.ktbyte.com/",
  },
];
export const technicalSkills = {
  Languages: [
    "Python",
    "Java",
    "C++",
    "SQL",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "Kotlin",
    "Bash",
  ],
  Technologies: [
    "React",
    "Next.js",
    "Flask",
    "FastAPI",
    "Mantine UI",
    "Material UI",
    "WordPress",
  ],
  "AI & data": [
    "PyTorch",
    "LangChain",
    "LangGraph",
    "SentenceTransformers",
    "NumPy",
    "Pandas",
    "scikit-learn",
    "XGBoost",
    "ChromaDB",
    "Hugging Face",
    "Ollama",
    "Isaac Sim",
  ],
  Databases: [
    "PostgreSQL",
    "pgvector",
    "PostGIS",
  ],
  "Cloud & platforms": [
    "Vercel",
    "Docker",
    "Google Cloud",
    "Microsoft Azure",
    "Cloudflare API",
    "Firebase",
    "Firebase Cloud Messaging",
    "Google Maps / Places API",
    "Netlify",
    "GitHub Pages",
    "Linux",
    "Tailscale",
    "Plesk",
    "HubSpot",
  ],
  "Developer tools": [
    "Git",
    "CI/CD",
    "GitLab CI/CD",
    "Android Studio",
    "Codex",
    "Claude",
    "Gemini",
    "Antigravity",
  ],
  "Systems & automation": [
    "SSH",
    "Webhooks",
    "cron",
    "rsync",
    "pg_dump",
    "DDNS",
    "mTLS",
    "Custom certificate authorities",
  ],
  Methods: [
    "Retrieval-augmented generation (RAG)",
    "Prompt engineering",
    "Maximal marginal relevance (MMR)",
    "PCA",
    "UMAP",
    "Support vector machines (SVM)",
    "Random forests",
    "Logistic regression",
    "Cross-validation",
    "Bootstrapping",
  ],
} as const;
export const award =
  "1st in the Beginner Division and 6th of 131 teams overall at the SIGPwny (ACM @ UIUC) Fall CTF Competition, 2025.";
