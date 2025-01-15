'use client'
import { title, subtitle } from "@/components/primitives";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Link } from "@nextui-org/link";

export default function PricingPage() {
  return (
    <div className="w-full">
      <h1 className={title()}>Projects</h1>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
        <Table aria-label="Example static collection table" className="max-w-3xl">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>DESCRIPTION</TableColumn>
            <TableColumn>LINK</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>LHS Schedule</TableCell>
              <TableCell>Developed and launched a successful web app to address my high school's confusing schedule.</TableCell>
              <TableCell>
                <Link aria-label="Read more about LHS Schedule" href="projects/lhsschedule">Read more</Link> or 
                <Link isExternal aria-label="LHS Schedule Link" href="https://lhsschedule.netlify.app/">open</Link>
              </TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>Project 2</TableCell>
              <TableCell>Description 2</TableCell>
              <TableCell>Link 2</TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}