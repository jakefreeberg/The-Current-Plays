import { load } from 'cheerio';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import dayjs from 'dayjs';

const url = 'https://www.thecurrent.org/playlist/the-current/';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const currentData: Array<Record<string, string>> = [];
  const pathSegments = req.nextUrl.pathname.split('/');
  //[ '', 'api', '2024-01-02', '2024-01-02' ]
  const start = pathSegments[2];
  const end = pathSegments[3];
  let currentDay = start;
  do {
    console.log(currentDay);
    const response = await axios.get(url + currentDay);

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
    currentDay = dayjs(currentDay).add(1, 'day').format('YYYY-MM-DD');
  } while (currentDay !== dayjs(end).add(1, 'day').format('YYYY-MM-DD'));

  return NextResponse.json(currentData);
}
