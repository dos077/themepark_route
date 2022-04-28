import Vue from 'vue';
import VueRouter from 'vue-router';
import EasyMode from '../views/EasyMode.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Easy Search',
    component: EasyMode,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
