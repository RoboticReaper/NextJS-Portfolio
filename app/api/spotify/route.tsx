import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const data = await sql`SELECT * FROM songs;`;

    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'no-store', // Ensures the data is always fresh
        },
    });
}