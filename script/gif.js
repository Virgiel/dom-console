const fs = require('fs');
const puppeteer = require('puppeteer');

const GIFEncoder = require('gifencoder');
const PNG = require('png-js');

function decode(png) {
  return new Promise(r => {
    png.decode(pixels => r(pixels));
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 100,
  });
  const page = await browser.newPage();
  page.setViewport({ width: 600, height: 530 });
  await page.goto(`file:///${process.cwd()}/gif.html`);

  const buffer = Array(20);
  for (let i = 0; i < 20; i++) {
    buffer[i] = page.screenshot({
      clip: { width: 600, height: 530, x: 0, y: 0 },
    });
  }

  // record gif
  var encoder = new GIFEncoder(600, 530);
  encoder.createWriteStream().pipe(fs.createWriteStream('../assets/demo.gif'));

  // setting gif encoder
  encoder.start();
  encoder.setRepeat(0);
  encoder.setFrameRate(1);
  encoder.setQuality(1);

  for (const item of buffer) {
    await decode(new PNG(item)).then(pixels => encoder.addFrame(pixels));
  }
  // finish encoder, test.gif saved
  encoder.finish();

  await browser.close();
})();
