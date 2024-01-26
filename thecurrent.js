const cheerio = require("cheerio");
const axios = require("axios");
const j2cp = require("json2csv").Parser;
const fs = require("fs");

const url = "https://www.thecurrent.org/playlist/the-current/2022-06-09";
const book_data = [];

async function getBooks() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const date = $("input[name=playlistDate]").attr("value");

    const hourBlocks = $(".playlist");
    hourBlocks.each(function () {
      const hour = $(this).prev().text();
      const cards = $(this).find(".playlist-card");
      cards.each(function () {
        const album = $(this).find(".playlist-title").text();
        const artist = $(this).find(".playlist-artist").eq(0).text();
        const song = $(this).find(".playlist-artist").eq(1).text();

        book_data.push({ date, hour, album, artist, song });
      });
    });

    //console.log(book_data);
    const parser = new j2cp();
    const csv = parser.parse(book_data);
    fs.writeFileSync("./current_info.csv", csv);
  } catch (error) {
    console.log(error);
  }
}

getBooks();
