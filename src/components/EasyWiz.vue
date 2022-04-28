<template>
  <v-card style="max-width: 48rem; margin: 0 auto" flat>
    <v-card-title>
      Plan Your Disneyland Visit
    </v-card-title>
    <v-card-text>
      <p class="subtitle-1">
        Disneyland has many immaginative, iconic, and historic attractions.
         It's impossible to see all of them in one visit on most days.
          Make the most out of yours.
      </p>
      <p class="subtitle-1">last update {{ updated }}</p>
      <v-divider class="my-2" />
      <div>
        <week-days />
        <time-range />
        <breaks-stops />
        <walk-speed />
        <rides-prf />
      </div>
      <v-divider class="mt-2" />
    </v-card-text>
    <v-card-actions>
      <v-btn-toggle :value="pessimistic ? 1 : 0" @change="changePessi"
        :color="pessimistic ? 'red' : 'blue'" dense group
        class="mr-4">
        <v-btn>average</v-btn>
        <v-btn>Worst Case</v-btn>
      </v-btn-toggle>
      <v-spacer />
      <v-btn outlined color="blue" icon
        @click="$store.dispatch('wizard/search')">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import WeekDays from './wizard/WeekDays.vue';
import TimeRange from './wizard/TimeRange.vue';
import WalkSpeed from './wizard/WalkSpeed.vue';
import RidesPrf from './wizard/RidesPrf.vue';
import BreaksStops from './wizard/BreaksStops.vue';
import waitsDb from '../data/waitTimes';

const weekDays = 'su mo tu we th fr sa'.split(' ');
const lastUpdate = waitsDb.updated;
lastUpdate.setDate(lastUpdate.getDate() - 2);

export default {
  name: 'EasyWiz',
  components: {
    WeekDays, TimeRange, WalkSpeed, RidesPrf, BreaksStops,
  },
  data: () => ({
    step: 0,
    updated: lastUpdate.toISOString().slice(0, 10),
  }),
  computed: {
    ...mapState('wizard', ['days', 'breaksTarget']),
    ...mapState(
      'settings',
      ['endTime', 'startTime', 'speed', 'pessimistic', 'scoreEm', 'noRides', 'speed', 'disEm'],
    ),
    stepTitle() {
      return [
        'Day and Time',
        'Walking Preferences',
        'Ride Preferences',
        'Rides and Breaks',
        'Confirmation',
      ][this.step];
    },
    settingSummary() {
      const {
        startTime, endTime, breaksTarget, speed, disEm, scoreEm,
      } = this;
      const daysStr = this.days.length === 7
        ? 'any day'
        : this.days.map((di) => weekDays[di]).join(', ');
      const startStr = startTime < 12 ? `${startTime}AM` : `${startTime}PM`;
      const endStr = endTime < 24 ? `${endTime - 12}PM` : `${endTime - 12}AM`;
      const breaksStr = `${breaksTarget / 2} hr`;
      let spdStr = 'loiter';
      if (speed === 4800) spdStr = 'slow';
      else if (speed === 5800) spdStr = 'fast';
      else if (speed === 6800) spdStr = 'jog';
      else if (speed === 7800) spdStr = 'speed';
      let disStr = 'little as possible';
      if (disEm > 1.5) disStr = 'any distance';
      else if (disEm > 0.5) disStr = 'moderate amount';
      let scoreStr = 'not a concern';
      if (scoreEm > 1.5) scoreStr = 'very important';
      if (scoreEm > 0.5) scoreStr = 'some consideration';
      return [
        `Visit ${daysStr}, ${startStr} - ${endStr}, ${breaksStr} breaks`,
        `Walk ${spdStr}, ${disStr}`,
        `Reviews scores - ${scoreStr}`,
      ];
    },
  },
  methods: {
    changePessi() {
      const { pessimistic } = this;
      this.$store.commit('settings/set', { pessimistic: !pessimistic });
    },
  },
};
</script>
