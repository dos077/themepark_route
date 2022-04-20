/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */
const fs = require('fs');
const puppeteer = require('puppeteer');

const rides = [
  { name: 'it\'s a small word', ride: 'itsasmallworld', id: 511 },
  { name: 'alice in wonderland', ride: 'aliceinwonderland', id: 131 },
  { name: 'astro orbitor', ride: 'astroorbitor', id: 940 },
  { name: 'autopia', ride: 'autopia', id: 132 },
  { name: 'big thunder mountain railroad', ride: 'bigthundermountainrailroad', id: 508 },
  { name: 'buzz lightyear astro blasters', ride: 'buzzlightyearastroblasters', id: 133 },
  { name: 'casey jr. circus train', ride: 'caseyjrcircustrain', id: 134 },
  { name: 'davy crockett\'s explorer canoes', ride: 'davycrockettsexplorercanoes', id: 565 },
  // { name: 'disneyland railroad', ride: 'disneylandrailroad', id: 136 },
  { name: 'dumbo the flying elephant', ride: 'dumbotheflyingelephant', id: 509 },
  // { name: 'finding nemo submarine voyage', ride: 'findingnemosubmarinevoyage', id: 137 },
  { name: 'gadget\'s go coaster', ride: 'gadgetsgocoaster', id: 138 },
  { name: 'haunted mansion', ride: 'hauntedmansion', id: 510 },
  { name: 'indiana jones adventure', ride: 'indianajonesadventure', id: 144 },
  { name: 'jungle cruise', ride: 'junglecruise', id: 512 },
  { name: 'king arthur carrousel', ride: 'kingarthurcarrousel', id: 146 },
  { name: 'mad tea party', ride: 'madteaparty', id: 513 },
  { name: 'matterhorn bobsleds', ride: 'matterhornbobsleds', id: 149 },
  { name: 'Millennium Falcon: Smugglers Run', ride: 'millenniumfalconsmugglersrun', id: 1097 },
  { name: 'Mr. Toad\'s Wild Ride', ride: 'mrtoadswildride', id: 153 },
  { name: 'Peter Pan\'s Flight', ride: 'peterpansflight', id: 514 },
  { name: 'Pinocchio\'s Daring Journey', ride: 'pinocchiosdaringjourney', id: 154 },
  { name: 'Pirates of the Caribbean', ride: 'piratesofthecaribbean', id: 515 },
  { name: 'Roger Rabbit\'s Car Toon Spin', ride: 'rogerrabbitscartoonspin', id: 161 },
  { name: 'Snow White\'s Enchanted Wish', ride: 'snowwhitesenchantedwish', id: 2006 },
  { name: 'space mountain', ride: 'spacemountain', id: 517 },
  { name: 'Splash Mountain', ride: 'splashmountain', id: 518 },
  { name: 'Star Tours – The Adventures Continue', ride: 'startourstheadventurescontinue', id: 519 },
  { name: 'Star Wars: Rise of the Resistance', ride: 'starwarsriseoftheresistance', id: 1580 },
  { name: 'Storybook Land Canal Boats', ride: 'storybooklandcanalboats', id: 163 },
  { name: 'The Many Adventures of Winnie the Pooh', ride: 'themanyadventuresofwinniethepooh', id: 520 },
  // { name: '', ride: '', id:  },
];

const scrap = async (pointA, ponitB, page) => {
  await page.goto('https://maps.google.com');
  const input = await page.$('#searchboxinput');
  await input.type(pointA);
  await page.keyboard.press('Enter');
  await page.waitForSelector('button[data-value="Directions"]');
  await new Promise((r) => setTimeout(r, 800));
  const dirBtn = await page.$('button[data-value="Directions"]');
  await dirBtn.click();
  await page.waitForSelector('img[aria-label="Walking"]');
  await new Promise((r) => setTimeout(r, 800));
  const walkBtn = await page.$('img[aria-label="Walking"]');
  await walkBtn.evaluate((el) => el.parentElement.click());
  await page.waitForSelector('input[placeholder="Choose starting point, or click on the map..."]');
  await new Promise((r) => setTimeout(r, 900));
  const bInput = await page.$('input[placeholder="Choose starting point, or click on the map..."]');
  await bInput.type(ponitB);
  await page.keyboard.press('Enter');
  await page.waitForSelector('#section-directions-trip-0');
  const disDiv = await page.$('#section-directions-trip-0');
  const str = await disDiv.evaluate((el) => el.textContent);
  console.log(str);
  const arr = str.split(' ');
  const unit = arr.includes('ft') ? 'ft' : 'mile';
  let unitIndex = arr.indexOf(unit);
  if (unitIndex < 0) unitIndex = arr.indexOf('miles');
  const n = arr[unitIndex - 1];
  console.log(n, unit);
  return unit === 'ft' ? n * 0.3048 : n * 1609.34;
};

const path = './src/data/disMap.json';

const saveMap = (data) => {
  fs.writeFileSync(path, JSON.stringify(data));
};

const loadMap = () => {
  if (fs.existsSync(path)) return JSON.parse(fs.readFileSync(path));
  return {};
};

const getCors = (rideA, rideB) => [rideA.id, rideB.id].sort((a, b) => a - b).join('-');

const main = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: false,
  });
  const mapped = loadMap();
  const page = await browser.newPage();
  for (let i = 0; i < rides.length; i += 1) {
    const rideA = rides[i];
    const pointA = `${rideA.name} Disneyland Drive, Anaheim, CA`;
    for (let j = 0; j < rides.length; j += 1) {
      if (j !== i) {
        const rideB = rides[j];
        const cors = getCors(rideA, rideB);
        if (!mapped[cors] || mapped[cors] > 3200) {
          console.log('finding distance', cors);
          const pointB = `${rideB.name} Disneyland Drive, Anaheim, CA`;
          const meters = await scrap(pointA, pointB, page);
          if (meters) {
            mapped[cors] = meters;
            saveMap(mapped);
          }
          await new Promise((r) => setTimeout(r, 2100));
        }
      }
    }
  }
  await browser.close();
};

main();
