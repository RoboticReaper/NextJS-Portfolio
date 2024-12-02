import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
    let epoch = Math.floor(new Date().getTime() / 1000);
    if(request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: 'unauthorized'}, { status: 401 });
    } else {
        let cocData = await fetch('https://cocproxy.royaleapi.dev/v1/players/%23LY8L20QQR', {
            headers: {
              'Authorization': `Bearer ${process.env.COC_API_KEY}`,
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())

        sql`
            UPDATE clashofclans
            SET playername = 'test'
            WHERE tag = '#LY8L20QQR'
        `
    
        return NextResponse.json({ message: 'success', cocData });
    }
}
