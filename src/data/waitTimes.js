/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import rides from './rides';

const waitDb = {};

rides.forEach(({ id, ride }) => {
  waitDb[id] = require(`./waits/${ride}.json`);
});

const calData = (trr) => {
  const min = Math.min(...trr);
  const max = Math.max(...trr);
  let total = 0;
  let n = 0;
  let trendTotal = 0;
  let trendN = 0;
  trr.forEach((t, i) => {
    if (t) {
      total += t;
      n += 1;
      if (i > 0 && trr[i - 1]) {
        trendTotal += (t / trr[i - 1]) * (i + 1);
        trendN += i + 1;
      }
    }
  });
  return {
    min, max, avg: total / n, trend: trendTotal / trendN, n,
  };
};

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const analyzeWaits = ({ dates, times, waits }) => {
  const res = {};
  times.slice(0, times.length - 2).forEach((time, y) => {
    const arr = {};
    dates.slice(0, dates.length - 1).forEach((date, x) => {
      if (waits[x][y]) {
        const day = (new Date(date)).getUTCDay();
        if (!arr[weekdays[day]]) arr[weekdays[day]] = [];
        arr[weekdays[day]].push(waits[x][y]);
      }
    });
    let hr = parseInt(time.slice(0, 2), 10);
    if (time.includes('PM') && hr < 12) hr += 12;
    if (time.includes('30')) hr += 0.5;
    res[hr] = {};
    weekdays.forEach((day) => {
      if (arr[day]) {
        res[hr][day] = calData(arr[day]);
      }
    });
  });
  return res;
};

const exportDb = {};

rides.forEach(({ id }) => {
  exportDb[id] = analyzeWaits(waitDb[id]);
});

const stats = {};

weekdays.forEach((day) => {
  stats[day] = {};
  rides.forEach(({ id }) => {
    const hrs = Object.keys(exportDb[id]);
    hrs.forEach((hr) => {
      if (!stats[day][hr]) stats[day][hr] = { total: 0, n: 0 };
      if (exportDb[id][hr] && exportDb[id][hr][day]) {
        stats[day][hr].total += exportDb[id][hr][day].avg;
        stats[day][hr].n += exportDb[id][hr][day].n;
      }
    });
  });
});

const hrRank = {};

weekdays.forEach((day) => {
  hrRank[day] = [];
  Object.keys(stats[day]).forEach((hr) => {
    const avg = stats[day][hr].total / stats[day][hr].n;
    hrRank[day].push({ hr: parseFloat(hr), avg });
  });
  hrRank[day].sort((a, b) => a.avg - b.avg);
});

const findShort = (day, breaks, space, minHr, maxHr) => {
  const filtered = hrRank[day].filter(({ hr }) => breaks
    .every((b) => Math.abs(hr - b) > space)
    && hr > minHr
    && hr < maxHr);
  if (filtered && filtered.length > 0) {
    return filtered[filtered.length - 1].hr;
  }
  return false;
};

const findLong = (day, breaks, space, minHr, maxHr) => {
  let best = false;
  let bestScore = null;
  const filtered = hrRank[day].filter(({ hr }) => breaks
    .every((b) => Math.abs(hr - b) > space)
  && hr > minHr
  && hr < maxHr);
  if (!filtered || filtered.length < 1) return false;
  for (let i = filtered.length - 1; i > 0; i -= 1) {
    const a = filtered[i];
    const adj = filtered.slice(0, i).filter((b) => Math.abs(a.hr - b.hr) < 1);
    if (adj && adj.length > 0) {
      const b = adj[adj.length - 1];
      const score = a.avg + b.avg;
      if (score > bestScore) {
        best = [a.hr, b.hr];
        bestScore = score;
      }
    }
  }
  return best;
};

const findBreaks = (day, target, minHr, maxHr) => {
  let longs = target > 3 ? target - Math.round(target / 2 + 1) : 0;
  let shorts = target - (longs * 2);
  const breaks = [];
  console.log('looking for breaks', longs, shorts);
  for (let space = 3; space > 1 && longs > 0; space -= 0.5) {
    let finds = findLong(weekdays[day], breaks, space, minHr, maxHr);
    while (finds) {
      breaks.push(...finds);
      longs -= 1;
      if (longs === 0) break;
      finds = findLong(weekdays[day], breaks, space, minHr, maxHr);
    }
  }
  for (let space = 3; space > 1 && shorts > 0; space -= 0.5) {
    let finds = findShort(weekdays[day], breaks, space, minHr, maxHr);
    while (finds && shorts > 0) {
      breaks.push(finds);
      shorts -= 1;
      if (shorts === 0) break;
      finds = findShort(weekdays[day], breaks, space, minHr, maxHr);
    }
  }
  return breaks;
};

// console.log(findBreaks(1, 4, 8, 22));

export default exportDb;
export { findBreaks };
