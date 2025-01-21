import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {

  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  await sql`TRUNCATE TABLE songs;` // clear the table

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN || '',
      client_id: process.env.SPOTIFY_CLIENT_ID || ''
    }).toString()
  });

  const body = await response.json();

  const token = body.access_token;

  let songs = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0", {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())

  // choose to only upload a few properties to postgres
  songs = songs.items.map((song: any) => {
    return {
      name: song.name,
      artist: song.artists[0].name,
      image: song.album.images[1].url,
      link: song.external_urls.spotify
    }
  })

  // create the sql command that stores all items in songs array into the table

  songs.forEach(async (song: any) => {
    sql`
      INSERT INTO songs (name, artist, image, link) VALUES (${song.name}, ${song.artist}, ${song.image}, ${song.link});
    `
  })

  // return successful message
  return NextResponse.json({ message: 'success', songs }, { status: 200 });
}
