const axios = require('axios');
const fs = require('fs');

const dayArg = process.argv[2] || '2022-06-09';
const url = `https://www.thecurrent.org/api/playlist/the-current/${dayArg}`;
const outputPath = './current_info.json';

async function getPlaylist() {
  try {
    const response = await axios.get(url);
    const jsonData = response.data;

    if (!jsonData || !Array.isArray(jsonData.plays)) {
      throw new Error('Unexpected API response format: missing plays array.');
    }

    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log(
      `Saved ${jsonData.plays.length} plays for ${dayArg} to ${outputPath}`,
    );
  } catch (error) {
    const status = error.response?.status;
    const details = error.response?.data?.message || error.message;
    console.error(
      `Failed to fetch playlist for ${dayArg}${
        status ? ` (HTTP ${status})` : ''
      }: ${details}`,
    );
    process.exitCode = 1;
  }
}

getPlaylist();
