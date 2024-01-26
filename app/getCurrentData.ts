import { load } from 'cheerio';
import axios from 'axios';

const url = 'https://www.thecurrent.org/playlist/the-current/';
const currentData: Array<Record<string, string>> = [];

export const getServerSideProps = async (iso: string) => {
  const response = await axios.get(url + iso);

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

  return currentData;
};
