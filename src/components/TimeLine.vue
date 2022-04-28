<template>
<v-card flatv-if="timeline">
    <div class="overline ml-8 pt-2">
      {{ totalRides }} rides, {{ totalDistance }}
    </div>
    <v-timeline dense align-top>
      <v-timeline-item v-for="(item, i) in timeline"
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
</v-card>
</template>

<script>
import { mapState } from 'vuex';
import { findDistance } from '../data/pos';
import RideCard from './RideCard.vue';

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
  name: 'TimeLine',
  components: { RideCard },
  data: () => ({ }),
  computed: {
    ...mapState(['path', 'details', 'allExpand']),
    ...mapState('settings', ['dayOfWeek']),
    timeline() {
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
    isDesktop() {
      return this.$vuetify.breakpoint.lgAndUp;
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    weekDay() {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.dayOfWeek];
    },
  },
  methods: {
  },
};
</script>
