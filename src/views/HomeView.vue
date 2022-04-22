<template>
<v-container>
  <v-row>
    <v-col :cols="isDesktop ? 4 : 12">
      <v-card class="mb-4" outlined>
        <v-card-text>
          <settings-panel :changeSettings="changeSettings" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="findRoute" plain color="blue">find route</v-btn>
          <v-btn v-if="isSaved" @click="loadRoute" plain color="red">load route</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="totalRides" outlined>
        <v-card-text>
          {{ totalRides }} attractions | {{ totalDistance }}
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!allExpand" plain color="blue" @click="allExpand = true">
            <v-icon>mdi-magnify-plus</v-icon>
            show route details
          </v-btn>
          <v-btn v-if="allExpand" plain color="red" @click="allExpand = false">
            <v-icon>mdi-magnify-minus</v-icon>
            hide route details
          </v-btn>
          <v-btn plain color="green" @click="saveRoute">save route</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col v-if="timeLine" :cols="isDesktop ? 8 : 12">
      <v-timeline dense align-top>
        <v-timeline-item v-for="(item, i) in timeLine"
          :key="i" :color="item.color" :icon="item.icon" right>
          <v-row>
            <v-col :cols="isMobile ? 12 : 2">
              <span class="overline">{{ item.time }}</span>
            </v-col>
            <v-col :cols="isMobile ? 12 : 10" style="max-width: 36rem;">
              <ride-card :item="item" :allExpand="allExpand" />
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-timeline>
    </v-col>
  </v-row>
  <v-overlay :value="loading">
    {{ loadingMsg }}
    <v-progress-circular indeterminate />
  </v-overlay>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
import rides from '../data/rides';
// import waitTimes from '../data/waitTimes';
import Optimizer from '../data/optimizer';
import { findDistance } from '../data/pos';
import SettingsPanel from '../components/SettingsPanel.vue';
import RideCard from '../components/RideCard.vue';

const scores = require('../data/scores.json');

const opt = Optimizer();

const hr2text = (n) => {
  let hr = Math.floor(n);
  let min = Math.round((n - hr) * 60);
  const mm = hr > 11 ? 'PM' : 'AM';
  if (hr > 12) hr -= 12;
  if (hr < 10) hr = `0${hr}`;
  if (min < 10) min = `0${min}`;
  return `${hr}:${min} ${mm}`;
};

const time2color = (hr) => {
  if (hr > 0.75) return 'red';
  if (hr > 0.5) return 'deep-orange';
  if (hr > 0.33) return 'amber';
  if (hr > 0.17) return 'lime';
  return 'green';
};

const m2FtOrMi = (m) => (m < 304
  ? `${Math.round((m * 3.2808) / 50) * 50} ft`
  : `${Math.round(m * 0.00621371 * 2) / 20} mile`);

export default {
  name: 'HomeView',
  components: { SettingsPanel, RideCard },
  data: () => ({
    rideOptions: rides.map(({ name, id }) => ({ text: name, value: id })),
    changeSettings: opt.changeSettings,
    allExpand: false,
  }),
  computed: {
    ...mapState(['path', 'details', 'loading', 'loadingMsg']),
    timeLine() {
      if (!this.path) return null;
      const timeLine = [];
      this.path.forEach((id, i) => {
        const { arrival, wait, stay } = this.details[i];
        if (stay > 0) {
          const distance = i > 0 ? findDistance(this.path[i - 1], id) : 0;
          const color = time2color(wait + stay);
          timeLine.push({
            id,
            arrival,
            wait,
            stay,
            distance,
            color,
            time: hr2text(arrival),
            icon: 'mdi-map-marker-check',
          });
        } else {
          timeLine.push({
            color: 'blue',
            id,
            arrival,
            wait,
            stay,
            time: hr2text(arrival),
            icon: 'mdi-coffee',
          });
        }
      });
      return timeLine;
    },
    totalRides() {
      if (!this.details) return null;
      return this.details.filter(({ stay }) => stay > 0).length;
    },
    totalDistance() {
      if (!this.path) return null;
      let total = 0;
      this.path.forEach((id, i) => {
        if (i > 0 && this.path[i - 1] !== id) {
          total += findDistance(this.path[i - 1], id);
        }
      });
      return m2FtOrMi(total);
    },
    totalScores() {
      if (!this.details) return null;
      const { path, details } = this;
      let total = 0;
      details.forEach((d, i) => {
        if (d.stay > 0) total += scores[path[i]];
      });
      return total;
    },
    totalPrf() {
      if (!this.details) return null;
      const { details } = this;
      let total = 0;
      details.forEach((d) => {
        if (d.score) total += d.score;
      });
      return total;
    },
    isSaved() {
      if (!localStorage || !localStorage.getItem('savedRoute')) return false;
      const saved = JSON.parse(localStorage.getItem('savedRoute'));
      console.log(saved);
      return saved.path && saved.details;
    },
    isDesktop() {
      return this.$vuetify.breakpoint.lgAndUp;
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    findRoute() {
      this.$store.commit('find');
    },
    saveRoute() {
      if (this.path) {
        const { details, path } = this;
        const { dayOfWeek } = opt.showSettings();
        if (localStorage) {
          localStorage.setItem(
            'savedRoute',
            JSON.stringify({
              path, details, dayOfWeek,
            }),
          );
        }
      }
    },
    loadRoute() {
      this.$store.commit('load');
    },
  },
};
</script>
