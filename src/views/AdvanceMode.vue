<template>
<v-container :fluid="isMobile">
  <v-row :no-gutters="isMobile">
    <v-col :cols="isDesktop ? 4 : 12">
      <v-card class="mb-4" outlined>
        <v-card-text>
          <settings-panel />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="findRoute" plain color="blue">find route</v-btn>
          <v-btn v-if="isSaved" @click="loadRoute" plain color="red">load route</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col :cols="isDesktop ? 8 : 12">
      <time-line />
    </v-col>
  </v-row>
  <v-overlay :value="loading" opacity="8">
    {{ loadingMsg }}
  </v-overlay>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
import rides from '../data/rides';
// import waitTimes from '../data/waitTimes';
import SettingsPanel from '../components/SettingsPanel.vue';
import TimeLine from '../components/TimeLine.vue';

const scores = require('../data/scores.json');

export default {
  name: 'AdvanceMode',
  components: { SettingsPanel, TimeLine },
  data: () => ({
    rideOptions: rides.map(({ name, id }) => ({ text: name, value: id })),
  }),
  computed: {
    ...mapState(['path', 'details', 'loading', 'loadingMsg']),
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
    loadRoute() {
      this.$store.commit('load');
    },
  },
};
</script>
