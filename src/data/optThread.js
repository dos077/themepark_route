/* eslint-disable no-restricted-globals */
import Optimizer from './optimizer';

self.addEventListener('message', (e) => {
  const opti = Optimizer();
  opti.changeSettings(e.data);
  const route = opti.findRoute();
  let prf = 0;
  route.details.forEach((d) => { prf += d.score || 0; });
  self.postMessage({
    path: route.pathed.slice(1),
    details: route.details,
    prf,
    day: e.data.dayOfWeek,
  });
});

/*
const workers = [];
const threadsDone = [];
for (let i = 0; i < threads; i += 1) {
  workers.push(new Worker('../data/optThread.js', { type: 'module' }));
}
for (let i = 0; i < 10; i += threads) {
  for (let j = 0; j < threads; j += 1) {
    const worker = workers[j];
    worker.onmessage = ((route) => {
      console.log('thread done', j, route);
      threadsDone.push(route);
    });
    worker.postMessage(opti.showSettings());
  }
  while (threadsDone.length < i + threads) {
    await wait(1000); //eslint-disable-line
  }
}
for (let r = 0; r < threadsDone.length; r += 1) {
  const route = threadsDone[r];
  if (!best || best.prf < route.prf) best = route;
}
workers.forEach((worker) => worker.terminate());
*/
