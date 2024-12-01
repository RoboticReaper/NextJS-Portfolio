import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
    let epoch = Math.floor(new Date().getTime() / 1000);
    if(request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: 'unauthorized'}, { status: 401 });
    } else {
        let cocData = await fetch('https://api.clashofclans.com/v1/players/%23LY8L20QQR', {
            headers: {
              'Authorization': `Bearer ${process.env.COC_API_KEY}`
            }
        }).then(res => res.json())

        sql`INSERT INTO clashofclans (name, townhall) VALUES ('test', ${JSON.stringify(cocData)})`
    
        return NextResponse.json({ message: 'success', cocData });
    }
}
