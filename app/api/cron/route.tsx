import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
    let epoch = Math.floor(new Date().getTime() / 1000);
    if(request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: 'unauthorized'}, { status: 401 });
    } else {
        let cocData = await fetch('https://api.clashofclans.com/v1/players/%23LY8L20QQR', {
            headers: {
              'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImE1NmI0YjA4LTE1ZjItNGI3OC1hZjQ4LTczYTEyNWY5YzkyMiIsImlhdCI6MTczMTc4Mzk3NCwic3ViIjoiZGV2ZWxvcGVyLzFjN2NkMDhjLWVmNWMtNmRlMy05YzBkLWQyMThkYzJlOTM3NiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjc2Ljc2LjIxLjYxIiwiNzYuNzYuMjEuMTIzIl0sInR5cGUiOiJjbGllbnQifV19.iFVLL7deOzv7cl0eGuByhOpfF0UDQEyGgf51XdEIwAX6DQk5WySsJycKeYY7Y-BSNzlnNn2tQ8SHA6_WgjADhA`
            }
        }).then(res => res.json()).then(data => console.log(data))

        sql`INSERT INTO clashofclans (name, townhall) VALUES ('test', ${JSON.stringify(cocData)})`
    
        return NextResponse.json({ message: 'success' });
    }
}
