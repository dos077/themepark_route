import rides from './rides';
import waitTimes from './waitTimes';
import { findDistance } from './pos';

const scores = require('./scores.json');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const defaultSettings = () => ({
  speed: 4800,
  startTime: 8,
  endTime: 22,
  startPoint: null,
  dayOfWeek: 0,
  breaks: [11, 14, 14.5, 18],
  buffer: 0.17,
  noRides: [],
  maxDisHr: 2000,
  batchLimit: 8000,
  batchDepth: 4,
  scoreEm: 1,
  disEm: 1,
  timeEm: 1,
  pessimistic: false,
});

const rideIds = rides.map(({ id }) => id);

const optimizer = () => {
  const settings = defaultSettings();

  const scoresAdjust = (b, a, time) => {
    const {
      scoreEm, disEm, timeEm, buffer,
    } = settings;
    let total = 0;
    let n = 0;
    if (scoreEm) {
      const score = scores[b];
      total += (score - 4) * scoreEm;
      n += scoreEm;
    }
    if (disEm && a) {
      const distance = findDistance(a, b);
      const disScore = distance > 50 ? Math.log(50) / Math.log(distance) : 1;
      total += disScore * disEm;
      n += disEm;
    }
    if (timeEm) {
      const timeScore = time > buffer + 0.1 ? ((buffer + 0.1) / time) ** 0.5 : 1;
      total += timeScore * timeEm;
      n += timeEm;
    }
    if (!total) return scores[b] / 5;
    return total / n;
  };

  const calTime = (a, b, startTime) => {
    const spd = settings.speed;
    const day = settings.dayOfWeek;
    const { pessimistic } = settings;
    // console.log(a, 'to', b, 'start', startTime);
    const distance = a ? findDistance(a, b) : 0;
    const travelTime = distance / spd;
    // console.log('travel time', travelTime);
    const arrival = startTime + travelTime;
    const hrSlot = Math.round(arrival / 0.5) * 0.5;
    // console.log('wait slot', waitTimes[b]);
    if (
      !waitTimes[b] || !waitTimes[b][hrSlot] || !waitTimes[b][hrSlot][weekdays[day]]
    ) return false;
    const { avg, trend, max } = waitTimes[b][hrSlot][weekdays[day]];
    if (!avg) return false;
    let wait = pessimistic ? max : avg;
    if (trend) wait *= trend;
    return {
      arrival, wait: wait / 60, stay: settings.buffer, distance,
    };
  };

  const testBranch = (branch, startTime, breaks) => {
    const { endTime } = settings;
    let newStartTime = startTime;
    let score = 0;
    const pathed = [];
    const details = [];
    const breaksLeft = [...breaks];
    for (let i = 1; i < branch.length; i += 1) {
      while (breaksLeft.length > 0 && breaksLeft[0] <= newStartTime) {
        pathed.push(branch[i - 1]);
        details.push({ arrival: newStartTime, wait: 0.5, stay: 0 });
        newStartTime += 0.5;
        breaksLeft.shift();
      }
      const newStep = calTime(branch[i - 1], branch[i], newStartTime);
      if (!newStep) break;
      const newTime = newStep.arrival + newStep.wait + newStep.stay;
      if (newTime > endTime - 0.25) break;
      newStep.score = scoresAdjust(branch[i], branch[i - 1], newTime - newStartTime);
      details.push({ ...newStep });
      score += newStep.score;
      pathed.push(branch[i]);
      newStartTime = newTime;
    }
    return {
      newStartTime,
      score,
      pathed,
      breaksLeft,
      details,
    };
  };

  const branchBuilder = (pathed) => {
    const { noRides, batchLimit } = settings;
    const n = settings.batchDepth;
    const safeIds = rideIds.filter((id) => !pathed.includes(id) && !noRides.includes(id));
    let branches = safeIds.map((id) => [id]);
    for (let i = 1; i < n; i += 1) {
      const newBranches = [];
      branches.forEach((branch) => {
        safeIds.filter((id) => !branch.includes(id)).forEach((id) => {
          newBranches.push([...branch, id]);
        });
        while (newBranches.length > batchLimit) {
          const cutIndex = Math.floor(Math.random() * (newBranches.length));
          newBranches.splice(cutIndex, 1);
        }
      });
      if (!newBranches || newBranches.length === 0) break;
      branches = newBranches;
    }
    return branches;
  };

  const batchSearch = ({
    speed,
    dayOfWeek,
    startTime,
    endTime,
    breaks,
    pathed,
    details,
    noRides,
  }) => {
    let bestBranch = [];
    let bestTime = null;
    let bestScore = null;
    let breaksLeft = breaks;
    let newDetails = [];
    const batch = branchBuilder(pathed);
    batch.forEach((branch) => {
      const res = testBranch(
        [pathed[pathed.length - 1], ...branch],
        startTime,
        breaks,
      );
      if (res.score) {
        const deltaT = res.newStartTime - startTime;
        if (!bestScore || bestScore < res.score) {
          bestBranch = res.pathed;
          bestTime = deltaT;
          bestScore = res.score;
          breaksLeft = res.breaksLeft;
          newDetails = res.details;
        }
      }
    });
    if (bestScore) {
      const newTime = startTime + bestTime;
      const newPathed = [...pathed, ...bestBranch];
      if (newTime >= endTime - 0.25 || newPathed.length === rides.length) {
        return { pathed: newPathed, details: [...details, ...newDetails] };
      }
      return batchSearch({
        speed,
        dayOfWeek,
        startTime: newTime,
        endTime,
        breaks: breaksLeft,
        pathed: newPathed,
        details: [...details, ...newDetails],
        noRides,
      });
    }
    return { pathed, details: [...details, ...newDetails] };
  };

  const changeSettings = ({
    speed, startTime, endTime, startPoint, dayOfWeek, breaks, maxDisHr,
    scoreEm,
    disEm,
    timeEm,
    noRides,
    pessimistic,
  }) => {
    if (speed !== undefined) settings.speed = speed;
    if (startTime !== undefined) settings.startTime = startTime;
    if (endTime !== undefined) settings.endTime = endTime;
    if (startPoint !== undefined) settings.startPoint = startPoint;
    if (dayOfWeek !== undefined) settings.dayOfWeek = dayOfWeek;
    if (breaks !== undefined) settings.breaks = breaks;
    if (maxDisHr !== undefined) settings.maxDisHr = maxDisHr;
    if (scoreEm !== undefined) settings.scoreEm = scoreEm;
    if (disEm !== undefined) settings.disEm = disEm;
    if (timeEm !== undefined) settings.timeEm = timeEm;
    if (noRides !== undefined) settings.noRides = noRides;
    if (pessimistic !== undefined) settings.pessimistic = pessimistic;
    console.log('setting change', settings);
  };

  const findRoute = () => batchSearch({
    ...settings,
    pathed: [settings.startPoint],
    details: [],
  });

  const showSettings = () => ({ ...settings });

  return {
    changeSettings, findRoute, testBranch, showSettings,
  };
};

export default optimizer;
export { defaultSettings };
