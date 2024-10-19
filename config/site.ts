export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Baoren Liu's Website",
  description: "I am a freshman studying at Northeastern University. You can learn more about me on this website.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Education",
      href: "/education",
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
      label: "Home",
      href: "/",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Education",
      href: "/education",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contacts",
      href: "/contacts",
    },
  ],
  links: {
    github: "https://github.com/RoboticReaper",
    instagram: "https://www.instagram.com/littleant2333/",
    discord: "https://discord.com/users/1294767398972428391",
    projects: "/projects",
    about: "/about"
  },
};
