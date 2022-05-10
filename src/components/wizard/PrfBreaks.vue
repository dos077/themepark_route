<template>
  <v-col :cols="isMobile ? 12 : 6">
    <span v-if="!isMobile" class="overline">Breaks</span>
    <v-slider v-if="!manualMode" :min="2" :max="6" :step="1" ticks="always" color="blue lighten-3"
      :tick-labels="['1 hr', '', '2', '', '3']"
      :prepend-icon="isMobile ? 'mdi-coffee' : null"
      :value="breaksTarget" @change="setBreaksTarget">
      <template v-slot:append>
        <v-btn plain color="blue" @click="switchMode">
          pick
        </v-btn>
      </template>
    </v-slider>
    <v-sheet v-if="manualMode">
      <v-chip v-for="chip in breakChips" :key="chip.value" @click:close="removeBreak(chip.value)"
        class="ma-1" color="blue" outlined close>
        {{ chip.text }}
      </v-chip>
      <v-select :items="breakOptions" v-model="breakSlotSelected" label="add break">
        <template v-slot:append-outer>
          <v-btn icon color="blue" @click="addBreak">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn plain color="red" @click="switchMode">
            auto
          </v-btn>
        </template>
      </v-select>
    </v-sheet>
  </v-col>
</template>

<script>
import { mapState } from 'vuex';

const hr2text = (n) => {
  let hr = Math.floor(n);
  let min = Math.round((n - hr) * 60);
  const mm = hr > 11 ? 'PM' : 'AM';
  if (hr > 12) hr -= 12;
  if (hr < 10) hr = `0${hr}`;
  if (min < 10) min = `0${min}`;
  return `${hr}:${min} ${mm}`;
};

export default {
  name: 'PrfBreaks',
  data: () => ({
    manualMode: false,
    breakSlotSelected: null,
  }),
  computed: {
    ...mapState('settings', ['breaks', 'startTime', 'endTime']),
    ...mapState('wizard', ['breaksTarget']),
    breakOptions() {
      const { startTime, endTime, breaks } = this;
      const options = [];
      for (let hr = startTime + 0.5; hr < endTime - 0.5; hr += 0.5) {
        if (!breaks.includes(hr)) options.push(hr);
      }
      return options.map((value) => ({ text: hr2text(value), value }));
    },
    breakChips() {
      return this.breaks.map((b) => ({ text: hr2text(b), value: b }));
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    setBreaksTarget(val) {
      this.$store.commit('wizard/setBreaksTarget', val);
    },
    addBreak() {
      if (this.breakSlotSelected) {
        const { breaks, breakSlotSelected } = this;
        const newBreaks = [...breaks, breakSlotSelected];
        newBreaks.sort((a, b) => a - b);
        this.$store.commit('settings/set', { breaks: newBreaks });
      }
    },
    removeBreak(val) {
      const { breaks } = this;
      const newBreaks = breaks.filter((b) => b !== val);
      this.$store.commit('settings/set', { breaks: newBreaks });
    },
    switchMode() {
      const { manualMode } = this;
      if (manualMode) {
        this.$store.commit('wizard/setBreaksTarget', 4);
        this.manualMode = false;
      } else {
        this.$store.commit('wizard/setBreaksTarget', null);
        this.manualMode = true;
      }
    },
  },
};
</script>
