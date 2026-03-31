import { load } from 'cheerio';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const url = `https://www.thecurrent.org/api/playlist/the-current/`;

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const currentData: Array<Record<string, string>> = [];
  const pathSegments = req.nextUrl.pathname.split('/');

  const targetDay = pathSegments[2];
  const d1 = new Date().getTime();

  const response = await axios.get(url + targetDay);
  const d2 = new Date().getTime();

  const jsonData = response.data;

  if (!jsonData || !Array.isArray(jsonData.plays)) {
    throw new Error('Unexpected API response format: missing plays array.');
  }

  jsonData.plays.forEach((play: any) => {
    const date = play.played_at || 'UNKNOWN DATE';
    const hour =
      new Date(play.played_at).getHours().toString() || 'UNKNOWN HOUR';
    const album = play.song?.album || 'UNKNOWN ALBUM';
    const artist = play.song?.artist || 'UNKNOWN ARTIST';
    const song = play.song?.title || 'UNKNOWN SONG';

    currentData.push({ date, hour, album, artist, song });
  });

  const d3 = new Date().getTime();

  console.log('process time:', d3 - d2);
  console.log('total time:', d3 - d1);

  return NextResponse.json(currentData);
}
