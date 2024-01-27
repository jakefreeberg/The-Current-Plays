import { load } from 'cheerio';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const url = 'https://www.thecurrent.org/playlist/the-current/';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const currentData: Array<Record<string, string>> = [];
  const pathSegments = req.nextUrl.pathname.split('/');

  const targetDay = pathSegments[2];
  const d1 = new Date().getTime();

  const response = await axios.get(url + targetDay);
  const d2 = new Date().getTime();

  console.log('request time:', d2 - d1);
  const $ = load(response.data);
  // const start = $('script').last().prev().text();
  // const clean = start.substring(46, 10000).split('\\"').join('"');
  // /// const trimmed = clean.substring(0, clean.length - 2);

  // console.log(clean.length);

  const playlistDate = $('input[name=playlistDate]').attr('value');
  const date = playlistDate || 'UNKNOWN DATE';

  const hourBlocks = $('.playlist');
  hourBlocks.each(function () {
    const hour = $(this).prev().text();
    const cards = $(this).find('.playlist-card');
    cards.each(function () {
      const album = $(this).find('.playlist-title').text();
      const artist = $(this).find('.playlist-artist').eq(0).text();
      const song = $(this).find('.playlist-artist').eq(1).text();

      currentData.push({ date, hour, album, artist, song });
    });
  });

  const d3 = new Date().getTime();

  console.log('process time:', d3 - d2);
  console.log('total time:', d3 - d1);

  return NextResponse.json(currentData);
}
