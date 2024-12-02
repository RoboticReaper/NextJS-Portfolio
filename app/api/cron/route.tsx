import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
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
            SET playername = ${cocData.name}, townhall = ${cocData.townHallLevel}, trophies = ${cocData.trophies}, league = ${cocData.league.name}, leagueicon = ${cocData.league.iconUrls.small}
            WHERE tag = ${cocData.tag}
        `
    
        return NextResponse.json({ message: 'success', cocData });
    }
}
