const pos = {
  511: [33.81483873860269, -117.91783746519769],
  131: [33.81340465898457, -117.91827329707668],
  940: [33.81228041799697, -117.91829885389566],
  132: [33.81269933254026, -117.91641864184228],
  508: [33.81275954645422, -117.92041511272913],
  133: [33.81238099235937, -117.9180327450821],
  134: [33.81396058450013, -117.91915663723498],
  565: [33.81264141654328, -117.92204953839111],
  509: [33.813901470143534, -117.9188981797157],
  138: [33.81533102924124, -117.91941394181109],
  510: [33.811910061387266, -117.92219012432906],
  144: [33.81125480491018, -117.92053962683137],
  512: [33.811609891268645, -117.92016381048988],
  146: [33.81366757034033, -117.91897739363904],
  513: [33.81364670037094, -117.91828450978707],
  149: [33.813391170520084, -117.91783102091583],
  1097: [33.81497581421375, -117.92137401114927],
  153: [33.8134815308059, -117.91875892636953],
  514: [33.81325588821814, -117.91890141206228],
  154: [33.8134595308254, -117.91927052637843],
  515: [33.81133770553637, -117.92086304228604],
  161: [33.81529111556333, -117.91809497094296],
  2006: [33.81324807333759, -117.91917429683718],
  517: [33.81115566323815, -117.91752535320086],
  518: [33.81228453129742, -117.92241640929431],
  519: [33.81212886177368, -117.91814464138352],
  1580: [33.81382143090969, -117.92320688370214],
  163: [33.81382457070934, -117.9182438374574],
  520: [33.81272998800097, -117.92314572387015],
};

export default pos;

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

const toRad = (deg) => deg * (Math.PI / 180);

const calDist = (corsA, corsB) => {
  const R = 6371000; // km
  const [lat1, lon1] = corsA;
  const [lat2, lon2] = corsB;
  const x1 = lat2 - lat1;
  const dLat = toRad(x1);
  const x2 = lon2 - lon1;
  const dLon = toRad(x2);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const test = () => {
  for (let i = 0; i < 1; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      if (j !== i) {
        console.log(rides[i].name, ' to ', rides[j].name);
        const corsA = pos[rides[i].id];
        const corsB = pos[rides[j].id];
        console.log(calDist(corsA, corsB));
      }
    }
  }
};

const findDistance = (id1, id2) => {
  const corsA = pos[id1];
  const corsB = pos[id2];
  let dis = calDist(corsA, corsB);
  if (dis > 700) {
    dis *= 1.8;
  } else if (dis > 600) {
    dis *= 1.6;
  } else if (dis > 310) {
    dis *= 1.4;
  } else if (dis > 180) {
    dis *= 1.25;
  }
  return dis;
};

export { test, findDistance };
