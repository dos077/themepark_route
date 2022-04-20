import rides from './rides';

const info = require('./info.json');
const scores = require('./scores.json');

const db = [];

rides.forEach((ride) => {
  const entry = { ...ride };
  entry.score = scores[ride.id];
  const rawInfo = info[ride.id];
  entry.img = rawInfo.img;
  entry.url = rawInfo.url;
  entry.land = rawInfo.land.trim();
  entry.height = rawInfo.height.includes('"')
    ? parseInt(rawInfo.height.split('"')[0], 10)
    : null;
  const ages = [];
  const ageStr = rawInfo.age;
  if (ageStr.includes('All')) ages.push('Preschooler', 'Kids', 'Teens', 'Adults');
  else {
    if (ageStr.includes('Preschool')) ages.push('Preschooler');
    if (ageStr.includes('Kids')) ages.push('Kids');
    if (ageStr.includes('Teens')) ages.push('Teens');
    if (ageStr.includes('Adults')) ages.push('Adults');
  }
  entry.ages = ages;
  const typeStr = rawInfo.type;
  const types = [];
  if (typeStr.includes('Small')) {
    types.push('small drops');
  }
  if (typeStr.includes('Slow')) {
    types.push('slow');
  }
  if (typeStr.includes('Spinning')) {
    types.push('spinning');
  }
  if (typeStr.includes('Thrill')) {
    types.push('thrill');
  }
  if (typeStr.includes('Loud')) {
    types.push('loud');
  }
  if (typeStr.includes('Scary')) {
    types.push('scary');
  }
  if (typeStr.includes('Water')) {
    types.push('water');
  }
  if (typeStr.includes('Dark')) {
    types.push('dark');
  }
  entry.types = types;
  db[entry.id] = entry;
});

const findAgeRides = (age) => {
  const ids = [];
  db.forEach(({ id, ages }) => {
    if (ages.includes(age)) ids.push(id);
  });
  console.log(ids);
  return ids;
};

const findTypeRides = (type) => {
  const ids = [];
  db.forEach(({ id, types }) => {
    if (types.includes(type)) ids.push(id);
  });
  return ids;
};

export default db;
export { findAgeRides, findTypeRides };
