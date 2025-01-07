'use client'
import { title, subtitle } from "@/components/primitives";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

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
              <TableCell>LHS Schedule asdf  asdf asdf </TableCell>
              <TableCell>CEO asdf asd fasdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf  </TableCell>
              <TableCell>Active asdf asdf </TableCell>
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