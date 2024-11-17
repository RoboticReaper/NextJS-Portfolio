import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  const {rows, fields} = await sql`SELECT * FROM clashofclans`
    
  return NextResponse.json({ rows, fields });
}
