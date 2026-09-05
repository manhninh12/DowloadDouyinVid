const { douyin } = require('btch-downloader');

async function test() {
  try {
    const url = "https://v.douyin.com/CjbnubiVl3c/";
    console.log("Fetching...", url);
    const res = await douyin(url);
    console.log("RESULT:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
