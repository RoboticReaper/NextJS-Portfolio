"use client";
import { title, subtitle } from "@/components/primitives";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Link } from "@heroui/link";
import { Breadcrumb } from "@/components/breadcrumb";

const projects = [
  {
    key: "1",
    name: "LHS Schedule",
    description:
      "Developed and launched a successful web app to address my high school's confusing schedule. Peak 1,300 users.",
    readLink: "projects/lhsschedule",
    openLink: "https://lhsschedule.netlify.app/",
  },
  {
    key: "2",
    name: "Coaching Website",
    description:
      "For coaches to introduce and show photos of their training, receive payments via Stripe for lesson bookings, and communicate with students. Contact me if interested in buying.",
    readLink: "projects/tennisWebsite",
    openLink: "https://barry-tennis-website.vercel.app/",
  },
  {
    key: "3",
    name: "Notes App",
    description:
      "A native Android app distributed on third-party app stores. 7k global downloads.",
    readLink: "projects/notes",
    openLink: "https://com-hoversfw-notes.en.aptoide.com/app",
  },
  {
    key: "4",
    name: "Fourier Series Visualizer",
    description:
      "Converts SVG file or any 2D parametric equation into fourier series and draws the graph onto the coordinate plane.",
    readLink: "projects/fourier",
    openLink: "https://github.com/RoboticReaper/Fourier-Series-Visualization",
  },
  {
    key: "5",
    name: "Naive Bayes Spam Detection",
    description:
      "A probabilistic classifier that detects spam messages. Inspired by my Discrete Structures class.",
    readLink: "projects/bayes",
    openLink: "https://github.com/RoboticReaper/NaiveBayesSpam",
  },
];

const blogs = [
  {
    key: "1",
    name: "Capture The Flag",
    description:
      "How I won my first CTF event in the beginners' division.",
    readLink: "projects/ctf",
  },
];



export default function ProjectsPage() {
  return (
    <div className="w-full text-center">
      <h1 className={title()}>Projects</h1>
      <Breadcrumb />
      <section className="flex flex-col items-center justify-center gap-4 py-2 md:py-3 w-full">
        <Table aria-label="Example static collection table" className="max-w-3xl">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>DESCRIPTION</TableColumn>
            <TableColumn>LINK</TableColumn>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.key}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <Link
                    aria-label={`Read more about ${project.name}`}
                    href={project.readLink}
                  >
                    Read
                  </Link>
                  {" "}/{" "}
                  <Link
                    isExternal
                    aria-label={`${project.name} Link`}
                    href={project.openLink}
                  >
                    Open
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>


      <br />
      <h1 className={title()}>Blog</h1>
      <br />
      <br />
      <section className="flex flex-col items-center justify-center gap-4 py-2 md:py-3 w-full">
        <Table aria-label="Example static collection table" className="max-w-3xl">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>DESCRIPTION</TableColumn>
            <TableColumn>LINK</TableColumn>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.key}>
                <TableCell>{blog.name}</TableCell>
                <TableCell>{blog.description}</TableCell>
                <TableCell>
                  <Link
                    aria-label={`Read more about ${blog.name}`}
                    href={blog.readLink}
                  >
                    Read
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}