/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */
const fs = require('fs');
const puppeteer = require('puppeteer');

const rides = require('./data/rides');

const baseUrl = 'https://disneyland.disney.go.com/attractions/disneyland';

const scrap = async (name, page) => {
  await page.goto(baseUrl);
  await page.waitForSelector('input');
  await new Promise((r) => setTimeout(r, 1000));
  const input = await page.$('input');
  await input.type(name.slice(0, name.length - 2));
  await new Promise((r) => setTimeout(r, 2000));
  await page.keyboard.press('ArrowDown');
  await new Promise((r) => setTimeout(r, 1000));
  await page.keyboard.press('Enter');
  await page.waitForSelector('ul.facets-list');
  await new Promise((r) => setTimeout(r, 2000));
  const res = {};
  res.url = await page.url();
  const arr = await page.$$('a[finderlinkid]');
  res.land = await arr[1].evaluate((el) => el.textContent);
  const uls = await page.$$('ul.facets-list');
  res.height = await uls[0].evaluate((ul) => ul.textContent);
  res.age = await uls[1].evaluate((ul) => ul.textContent);
  res.type = await uls[2].evaluate((ul) => ul.textContent);
  const picture = await page.$('picture');
  const img = await picture.$('img');
  res.img = await img.evaluate((el) => el.getAttribute('src'));
  return res;
};

const path = './src/data/info.json';

const saveData = (data) => {
  fs.writeFileSync(path, JSON.stringify(data));
};

const loadData = () => {
  if (fs.existsSync(path)) return JSON.parse(fs.readFileSync(path));
  return {};
};

const main = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 800,
  });
  const data = loadData();
  for (let i = 0; i < rides.length; i += 1) {
    const { name, id } = rides[i];
    if (!data[id]) {
      console.log('scraping', id, name);
      const res = await scrap(name, page);
      data[id] = res;
      saveData(data);
    }
  }
  saveData(data);
  await browser.close();
};

main();
