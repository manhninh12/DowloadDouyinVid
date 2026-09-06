const { youtube } = require('btch-downloader');

async function test() {
  try {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    console.log("Fetching YouTube...", url);
    const res = await youtube(url);
    console.log("RESULT:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
