export const siteConfig = {
  name: "Baoren Liu",
  description:
    "Computer Science + Mathematics student at UIUC. A few projects, interests, and things I’m learning along the way.",
  links: {
    github: "https://github.com/RoboticReaper",
    instagram: "https://www.instagram.com/littleant2333/",
    discord: "https://discord.com/users/1294767398972428391",
    resume: "/Baoren Liu Resume.pdf",
    email: "mailto:liubaoren2006@gmail.com",
  },
};
export const projects = [
  {
    title: "LHS Schedule",
    category: "Web application",
    description:
      "A web app I built to help students follow my high school’s six-day rotating schedule.",
    impact: "1,300 peak users",
    tags: ["React", "Firebase", "Product design"],
    href: "/projects/lhsschedule",
    external: "https://lhsschedule.netlify.app/",
    image: "/schedule_interface.png",
    tone: "mint",
  },
  {
    title: "Notes",
    category: "Android application",
    description:
      "A native Android notes app distributed on third-party app stores.",
    impact: "7k+ downloads",
    tags: ["Kotlin", "Android"],
    href: "https://com-hoversfw-notes.en.aptoide.com/app",
    external: "https://com-hoversfw-notes.en.aptoide.com/app",
    image: "/Notes.jpg",
    tone: "lavender",
  },
  {
    title: "Fourier Series Visualizer",
    category: "Math × code",
    description:
      "A visualizer that uses Fourier series to draw SVGs and 2D parametric curves.",
    impact: "SVG and parametric curves",
    tags: ["Python", "Mathematics"],
    href: "https://github.com/RoboticReaper/Fourier-Series-Visualization",
    external: "https://github.com/RoboticReaper/Fourier-Series-Visualization",
    image: null,
    tone: "peach",
  },
  {
    title: "Coaching Website",
    category: "Full-stack application",
    description:
      "A coaching website with lesson bookings, Stripe payments, photo galleries, and student communication.",
    impact: "Lesson bookings",
    tags: ["Web development", "Stripe"],
    href: "https://barry-tennis-website.vercel.app/",
    external: "https://barry-tennis-website.vercel.app/",
    image: null,
    tone: "blue",
  },
  {
    title: "Naive Bayes Spam Detection",
    category: "Machine learning",
    description:
      "A spam classifier using Naive Bayes, inspired by my discrete structures class.",
    impact: "Naive Bayes classifier",
    tags: ["Python", "Machine learning"],
    href: "https://github.com/RoboticReaper/NaiveBayesSpam",
    external: "https://github.com/RoboticReaper/NaiveBayesSpam",
    image: null,
    tone: "mint",
  },
];
export const skills = [
  "Python",
  "Java",
  "C++",
  "Kotlin",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Firebase",
  "MySQL",
] as const;
