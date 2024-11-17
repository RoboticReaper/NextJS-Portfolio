import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
    if(request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
    } else {
        sql`INSERT INTO clashofclans (name, townhall) VALUES ('test', 10)`
    
        return NextResponse.json({ message: 'success' });
    }
}
