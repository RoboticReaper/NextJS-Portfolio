import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {

    let cocData = await fetch('https://cocproxy.royaleapi.dev/v1/players/%23LY8L20QQR', {
        headers: {
            'Authorization': `Bearer ${process.env.COC_API_KEY}`,
            'Content-Type': 'application/json',
        }
    }).then(res => res.json())

    // cache control for 1 day
    return NextResponse.json({cocData}, {
        headers: {
            'Cache-Control': 'no-store', // Ensures the data is always fresh
        },
    });
}