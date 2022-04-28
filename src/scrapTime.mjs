/* eslint-disable no-await-in-loop */
import fetch from 'node-fetch';
import fs from 'fs';
// import rides from './data/rides';

const rides = [
  { name: 'It\'s a Small Word', ride: 'itsasmallworld', id: 511 },
  { name: 'Alice in Wonderland', ride: 'aliceinwonderland', id: 131 },
  { name: 'Astro Orbitor', ride: 'astroorbitor', id: 940 },
  { name: 'Autopia', ride: 'autopia', id: 132 },
  { name: 'Big Thunder Mountain Railroad', ride: 'bigthundermountainrailroad', id: 508 },
  { name: 'Buzz Lightyear Astro Blasters', ride: 'buzzlightyearastroblasters', id: 133 },
  { name: 'Casey Jr. Circus Train', ride: 'caseyjrcircustrain', id: 134 },
  { name: 'Davy Crockett\'s Explorer Canoes', ride: 'davycrockettsexplorercanoes', id: 565 },
  // { name: 'disneyland railroad', ride: 'disneylandrailroad', id: 136 },
  { name: 'Dumbo the Flying Elephant', ride: 'dumbotheflyingelephant', id: 509 },
  // { name: 'Finding Nemo Submarine Voyage', ride: 'findingnemosubmarinevoyage', id: 137 },
  // { name: 'gadget\'s go coaster', ride: 'gadgetsgocoaster', id: 138 },
  { name: 'Haunted Mansion', ride: 'hauntedmansion', id: 510 },
  { name: 'Indiana Jones Adventure', ride: 'indianajonesadventure', id: 144 },
  { name: 'Jungle Cruise', ride: 'junglecruise', id: 512 },
  { name: 'King Arthur Carrousel', ride: 'kingarthurcarrousel', id: 146 },
  { name: 'Mad Tea Party', ride: 'madteaparty', id: 513 },
  { name: 'Matterhorn Bobsleds', ride: 'matterhornbobsleds', id: 149 },
  { name: 'Millennium Falcon: Smugglers Run', ride: 'millenniumfalconsmugglersrun', id: 1097 },
  { name: 'Mr. Toad\'s Wild Ride', ride: 'mrtoadswildride', id: 153 },
  { name: 'Peter Pan\'s Flight', ride: 'peterpansflight', id: 514 },
  { name: 'Pinocchio\'s Daring Journey', ride: 'pinocchiosdaringjourney', id: 154 },
  // { name: 'Pirates of the Caribbean', ride: 'piratesofthecaribbean', id: 515 },
  // { name: 'Roger Rabbit\'s Car Toon Spin', ride: 'rogerrabbitscartoonspin', id: 161 },
  { name: 'Snow White\'s Enchanted Wish', ride: 'snowwhitesenchantedwish', id: 2006 },
  { name: 'Space Mountain', ride: 'spacemountain', id: 517 },
  { name: 'Splash Mountain', ride: 'splashmountain', id: 518 },
  { name: 'Star Tours – the Adventures Continue', ride: 'startourstheadventurescontinue', id: 519 },
  { name: 'Star Wars: Rise of the Resistance', ride: 'starwarsriseoftheresistance', id: 1580 },
  { name: 'Storybook Land Canal Boats', ride: 'storybooklandcanalboats', id: 163 },
  { name: 'The Many Adventures of Winnie the Pooh', ride: 'themanyadventuresofwinniethepooh', id: 520 },
  // { name: '', ride: '', id:  },
];

const baseUrl = 'https://www.thrill-data.com/waits/graph/quick/rideheat';

const dateTitle = '"y":';

const parseDates = (str) => {
  const dayIndex = str.indexOf(dateTitle);
  const dSliceStart = dayIndex + dateTitle.length;
  const dSliceEnd = str.indexOf(']', dSliceStart) + 1;
  const drr = JSON.parse(str.slice(dSliceStart, dSliceEnd));
  return drr;
};

const timeTitle = '"x":';

const parseTimes = (str) => {
  const dayIndex = str.indexOf(timeTitle);
  const dSliceStart = dayIndex + timeTitle.length;
  const dSliceEnd = str.indexOf(']', dSliceStart) + 1;
  const arr = JSON.parse(str.slice(dSliceStart, dSliceEnd));
  return arr;
};

const waitTitle = '"z":';

const parseWaits = (str) => {
  const dayIndex = str.indexOf(waitTitle);
  const dSliceStart = dayIndex + waitTitle.length;
  const dSliceEnd = str.indexOf(']]', dSliceStart) + 2;
  const arr = JSON.parse(str.slice(dSliceStart, dSliceEnd));
  return arr;
};

const scrap = async (id) => {
  const url = new URL(baseUrl);
  url.searchParams.append('id', id);
  url.searchParams.append('boarding', 'False');
  const now = new Date();
  now.setDate(now.getDate() - 2);
  const dateStart = now.toISOString().slice(0, 10);
  url.searchParams.append('dateStart', dateStart);
  url.searchParams.append('tag', 'half');
  const data = {};
  try {
    const res = await fetch(url);
    if (res.status !== 200) throw Error(res.status);
    const json = await res.json();
    if (!json.plot1) throw Error('plot1 not found');
    data.dates = parseDates(json.plot1);
    data.times = parseTimes(json.plot1);
    data.waits = parseWaits(json.plot1);
    data.updated = new Date();
  } catch (e) {
    console.log('id failed: ', id);
    console.log(e);
  }
  return data.waits ? data : null;
};

const saveSample = async () => {
  const url = new URL(baseUrl);
  url.searchParams.append('id', 138);
  url.searchParams.append('boarding', 'False');
  url.searchParams.append('dateStart', '2022-04-08');
  url.searchParams.append('tag', 'min');
  try {
    const res = await fetch(url);
    if (res.status !== 200) throw Error(res.status);
    const json = await res.json();
    if (!json.plot1) throw Error('plot1 not found');
    const samplePath = './src/data/sampleRide.json';
    fs.writeFileSync(samplePath, JSON.stringify(json.plot1));
  } catch (e) {
    console.log(e);
  }
};

// saveSample();

const saveWaits = (ride, data) => {
  const path = `./src/data/waits/${ride}.json`;
  fs.writeFileSync(path, JSON.stringify(data));
};

const loadWaits = (ride) => {
  const path = `./src/data/waits/${ride}.json`;
  if (fs.existsSync(path)) {
    console.log(ride, 'already exists');
    return JSON.parse(fs.readFileSync(path));
  }
  return null;
};

const main = async () => {
  for (let i = 0; i < rides.length; i += 1) {
    const { ride, id } = rides[i];
    const oldSave = loadWaits(ride);
    const now = new Date();
    if (!oldSave || !oldSave.updated || now - new Date(oldSave.updated) > 432000000) {
      console.log('scrapping new data', ride, id);
      const data = await scrap(id);
      if (data) saveWaits(ride, data);
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
};

main();

// console.log(await scrap(137));
