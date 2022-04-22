import Vue from 'vue';
import Vuex from 'vuex';
import Optimizer from '../data/optimizer';
import { findBreaks } from '../data/waitTimes';

const opti = Optimizer();

Vue.use(Vuex);

// eslint-disable-next-line no-promise-executor-return
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const settings = {
  namespaced: true,
  state: () => ({
    ...opti.showSettings(),
  }),
  mutations: {
    set(state, obj) {
      opti.changeSettings(obj);
      Object.keys(obj).forEach((key) => {
        if (state[key] !== undefined) {
          state[key] = obj[key];
        }
      });
    },
  },
};

const wizard = {
  namespaced: true,
  state: () => ({
    days: [0, 1, 2, 3, 4, 5, 6],
    breaksTarget: 4,
    threads: 10,
  }),
  mutations: {
    setDays(state, val) {
      state.days = val;
    },
    setBreaksTarget(state, val) {
      state.breaksTarget = val;
    },
  },
  actions: {
    async search({ state, commit, rootState }) {
      let best = null;
      const { days, breaksTarget, threads } = state;
      const { startTime, endTime } = rootState.settings;
      commit('setLoading', true, { root: true });
      wait(250);
      for (let d = 0; d < days.length; d += 1) {
        const day = days[d];
        commit('setLoadingMsg', `Routing ${weekdays[day]}`, { root: true });
        wait(250);
        commit('settings/set', { dayOfWeek: day }, { root: true });
        if (breaksTarget) {
          const breaks = findBreaks(day, breaksTarget, startTime, endTime);
          commit('settings/set', { breaks }, { root: true });
        }
        const workers = [];
        const threadsDone = [];
        for (let i = 0; i < threads; i += 1) {
          workers.push(
            new Worker(new URL('../data/optThread.js', import.meta.url)),
          );
        }
        for (let i = 0; i < 10; i += threads) {
          for (let j = 0; j < threads; j += 1) {
            const worker = workers[j];
            worker.onmessage = ((ev) => {
              // console.log('thread done', j, ev.data);
              threadsDone.push(ev.data);
            });
            worker.onerror = (err) => console.log(err);
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
      }
      console.log(best);
      if (best) {
        commit('setRoute', best, { root: true });
        commit('settings/set', { dayOfWeek: best.day }, { root: true });
      }
      commit('setLoading', false, { root: true });
    },
  },
};

export default new Vuex.Store({
  state: {
    path: null,
    details: null,
    loading: false,
    loadingMsg: '',
  },
  getters: {
  },
  mutations: {
    find(state) {
      const route = opti.findRoute();
      state.path = route.pathed.slice(1);
      state.details = route.details;
    },
    load(state) {
      if (localStorage && localStorage.getItem('savedRoute')) {
        const saved = JSON.parse(localStorage.getItem('savedRoute'));
        if (saved.path && saved.details) {
          state.path = saved.path;
          state.details = saved.details;
        }
      }
    },
    setRoute(state, { path, details }) {
      state.path = path;
      state.details = details;
    },
    setLoading(state, val) {
      state.loading = val;
    },
    setLoadingMsg(state, val) {
      state.loadingMsg = val;
    },
  },
  actions: {
  },
  modules: {
    settings,
    wizard,
  },
});
