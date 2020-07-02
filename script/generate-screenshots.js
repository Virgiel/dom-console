const puppeteer = require('puppeteer');

const config = name => {
  return {
    type: 'png',
    omitBackground: true,
    path: `../screenshots/${name}.png`,
  };
};
const names = ['example', 'print', 'err', 'warn', 'success', 'info', 'input'];
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 3 });
  await page.goto(`file:///${process.cwd()}/screenshot.html`);
  await page.waitForSelector('#dom-console');

  const domConsole = await page.$('#dom-console');
  for (const name of names) {
    await page.click('button');
    await domConsole.screenshot(config(name));
  }

  await browser.close();
})();
