export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Baoren Liu's Website",
  description: "I am a sophomore studying at University of Illinois Urbana-Champaign. You can learn more about me on this website.",
  navItems: [
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contacts",
      href: "/#contacts",
    },
  ],
  navMenuItems: [
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contacts",
      href: "/#contacts",
    },
  ],
  links: {
    github: "https://github.com/RoboticReaper",
    instagram: "https://www.instagram.com/littleant2333/",
    discord: "https://discord.com/users/1294767398972428391",
    projects: "/projects",
    about: "/about",
    resume: "/Baoren Liu Resume.pdf",
    projectLinks: [
      {
        label: "Projects",
        href: "/projects",
        id: -1,
      },
      {
        label: "LHS Schedule",
        href: "/projects/lhsschedule",
        id: 0,
      },
      {
        label: "Notes",
        href: "/projects/notes",
        id: 1,
      },
      {
        label: "Coaching Website",
        href: "/projects/coachingWebsite",
        id: 2,
      },
      {
        label: "Fourier Series Visualizer",
        href: "/projects/fourier",
        id: 3,
      },
      {
        label: "Naive Bayes Spam Detection",
        href: "/projects/bayes",
        id: 4,
      },
      {
        label: "Capture The Flag",
        href: "/projects/ctf",
        id: 5,
      },
    ]
  },
};
