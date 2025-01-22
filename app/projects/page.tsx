'use client'
import { title, subtitle } from "@/components/primitives";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Link } from "@heroui/link";
import { Breadcrumb } from "@/components/breadcrumb";

export default function PricingPage() {
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
            <TableRow key="1">
              <TableCell>LHS Schedule</TableCell>
              <TableCell>Developed and launched a successful web app to address my high school's confusing schedule. Peak 1,300 users.</TableCell>
              <TableCell>
                <Link aria-label="Read more about LHS Schedule" href="projects/lhsschedule">Read</Link> / 
                <Link isExternal aria-label="LHS Schedule Link" href="https://lhsschedule.netlify.app/">Open</Link>
              </TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>Coaching Website</TableCell>
              <TableCell>For coaches to introduce and show photos of their training, receive payments via Stripe for lesson bookings, and communicate with students. Contact me if interested in buying.</TableCell>
              <TableCell>
                <Link aria-label="Read more about tennis website" href="projects/tennisWebsite">Read</Link> / 
                <Link isExternal aria-label="Tebbis website link" href="https://barry-tennis-website.vercel.app/">Open</Link>
              </TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>Notes App</TableCell>
              <TableCell>A native Android app distributed on third-party app stores. 7k global downloads.</TableCell>
              <TableCell>
                <Link aria-label="Read more about Notes" href="projects/notes">Read</Link> / 
                <Link isExternal aria-label="Notes Link" href="https://com-hoversfw-notes.en.aptoide.com/app">Open</Link>
              </TableCell>
            </TableRow>
            <TableRow key="4">
              <TableCell>Fourier Series Visualizer</TableCell>
              <TableCell>Converts SVG file or any 2D parametric equation into fourier series and draws the graph onto the coordinate plane.</TableCell>
              <TableCell>
                <Link aria-label="Read more about the visualizer" href="projects/fourier">Read</Link> / 
                <Link isExternal aria-label="Repository link" href="https://github.com/RoboticReaper/Fourier-Series-Visualization">Open</Link>
              </TableCell>
            </TableRow>
            <TableRow key="5">
              <TableCell>Naive Bayes Spam Detection</TableCell>
              <TableCell>A probabilistic classifier that detects spam messages. Inspired by my Discrete Structures class.</TableCell>
              <TableCell>
                <Link aria-label="Read more about the spam detector" href="projects/bayes">Read</Link> / 
                <Link isExternal aria-label="Repository link" href="https://github.com/RoboticReaper/NaiveBayesSpam">Open</Link>
              </TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}