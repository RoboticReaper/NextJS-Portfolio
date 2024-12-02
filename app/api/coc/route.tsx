import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  const {rows, fields} = await sql`SELECT * FROM clashofclans`
    
  // cache control for 1 day
  return NextResponse.json({ rows, fields }, { headers: { 'Cache-Control': 's-maxage=86400' } });
}
