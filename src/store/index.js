import Vue from 'vue';
import Vuex from 'vuex';
import Optimizer from '../data/optimizer';

const opti = Optimizer();

Vue.use(Vuex);

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

export default new Vuex.Store({
  state: {
    path: null,
    details: null,
  },
  getters: {
  },
  mutations: {
    findRoute(state) {
      const route = opti.findRoute();
      state.path = route.pathed.slice(1);
      state.details = route.details;
    },
  },
  actions: {
  },
  modules: {
    settings,
  },
});
