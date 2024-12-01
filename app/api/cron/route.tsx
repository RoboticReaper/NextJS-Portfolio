import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
    let epoch = Math.floor(new Date().getTime() / 1000);
    if(request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: 'unauthorized', h: request.headers.get('Authorization') }, { status: 401 });
    } else {
        sql`INSERT INTO clashofclans (name, townhall) VALUES ('test', ${epoch})`
    
        return NextResponse.json({ message: 'success' });
    }
}
