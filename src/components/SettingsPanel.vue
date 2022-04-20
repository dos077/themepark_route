<template>
  <v-row>
    <v-col :cols="cols">
      <span class="overline">day of the week</span>
      <v-slider :min="0" :max="6" step="1"
        :value="dayOfWeek" :tick-labels="dayTexts" @change="changeDay" />
    </v-col>
    <v-col :cols="cols">
      <span class="overline">start time</span>
      <v-slider :min="8" :max="12" step="1" thick-label="always"
        :value="startTime" :tick-labels="startValues" @change="changeStartTime" />
    </v-col>
    <v-col :cols="cols">
      <span class="overline">end time</span>
      <v-slider :min="17" :max="24" step="1" :tick-labels="endValues"
        :value="endTime" @change="changeEndTime" />
    </v-col>
    <v-col :cols="cols">
      <span class="overline">walking peed</span>
      <v-slider :min="3800" :max="7800" step="1000"
        :tick-labels="speedLabels" :value="speed" @change="changeSpeed" />
    </v-col>
    <v-col :cols="cols">
      <span class="overline">Suitable Types</span>
      <v-chip-group v-model="typeSelected" multiple mandatory column color="blue">
        <v-chip v-for="type in types" :key="type" filter>
          {{ type }}
        </v-chip>
      </v-chip-group>
    </v-col>
    <v-col :cols="cols">
      <span class="overline">breaks</span>
      <v-sheet>
        <v-chip v-for="chip in breakChips" :key="chip.value" @click:close="removeBreak(chip.value)"
          class="ma-1" color="blue" outlined close>
          {{ chip.text }}
        </v-chip>
      </v-sheet>
      <v-select :items="breakOptions" v-model="breakSlotSelected" label="add break">
        <template v-slot:append-outer>
          <v-btn icon color="blue" @click="addBreak">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
      </v-select>
    </v-col>
    <v-col :cols="cols">
      <span class="overline">search preferences</span>
      <v-slider :min="0" :max="2" :step="0.5" ticks="always" label="ratings"
        :value="scoreEm" @change="changeScoreEm">
        <template v-slot:append>
          <v-icon color="blue">mdi-star-plus</v-icon>
        </template>
      </v-slider>
      <v-slider :min="0" :max="2" :step="0.5" ticks="always" label="walk"
        :value="disEm" @change="changeDisEm">
        <template v-slot:append>
          <v-icon color="blue">mdi-run-fast</v-icon>
        </template>
      </v-slider>
      <v-slider :min="0" :max="2" :step="0.5" ticks="always" label="rides"
        :value="timeEm" @change="changeTimeEm">
        <template v-slot:append>
          <v-icon color="blue">mdi-map-marker-plus</v-icon>
        </template>
      </v-slider>
    </v-col>
    <v-col :cols="cols">
      <span class="overline">Time Estimate</span>
      <v-switch :value="pessimistic" :label="pessimistic ? 'worst case' : 'average' "
        @click="changePessi"/>
    </v-col>
  </v-row>
</template>

<script>
import { defaultSettings } from '../data/optimizer';
import { findTypeRides } from '../data/ridesDb';

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
  name: 'SettingsPanel',
  props: ['changeSettings'],
  data: () => ({
    ...defaultSettings,
    speedOptions: [
      { text: 'sightseeing', value: 4000 },
      { text: 'slow', value: 4800 },
      { text: 'average', value: 6200 },
      { text: 'haste', value: 7800 },
    ],
    speedLabels: ['loiter', 'slow', 'fast', 'jog', 'speed'],
    startValues: [8, 9, 10, 11, 12],
    startTexts: [8, 9, 10, 11, 12].map((hr) => hr2text(hr)),
    endValues: [17, 18, 19, 20, 21, 22, 23, 24],
    endTexts: [17, 18, 19, 20, 21, 22, 23, 24].map((hr) => hr2text(hr)),
    dayValues: [0, 1, 2, 3, 4, 5, 6],
    dayTexts: ['S', 'M', 'Tu', 'W', 'Th', 'F', 'S'],
    breakSlotSelected: null,
    types: ['small drops', 'slow', 'spinning', 'thrill', 'loud', 'scary', 'water', 'dark'],
    typeSelected: [0, 1, 2, 3, 4, 5, 6, 7],
  }),
  computed: {
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
    isDesktop() {
      return this.$vuetify.breakpoint.lgAndUp;
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    cols() {
      if (this.isDesktop || this.isMobile) return 12;
      return 6;
    },
  },
  watch: {
    typeSelected(to) {
      if (to && to.length < 8) {
        const filters = this.types.filter((t, i) => !to.includes(i));
        console.log('filtering type', filters);
        const noRides = [];
        filters.forEach((type) => {
          noRides.push(...findTypeRides(type));
        });
        console.log(noRides);
        this.changeSettings({ noRides });
      } else {
        this.changeSettings({ noRides: [] });
      }
    },
  },
  methods: {
    changeSpeed(val) {
      this.changeSettings({ speed: val });
      this.speed = val;
    },
    changeStartTime(val) {
      this.changeSettings({ startTime: val });
      this.startTime = val;
    },
    changeEndTime(val) {
      this.changeSettings({ endTime: val });
      this.endTime = val;
    },
    changeDay(val) {
      this.changeSettings({ dayOfWeek: val });
      this.dayOfWeek = val;
    },
    addBreak() {
      if (this.breakSlotSelected) {
        const { breaks, breakSlotSelected } = this;
        const newBreaks = [...breaks, breakSlotSelected];
        newBreaks.sort((a, b) => a - b);
        this.changeSettings({ breaks: newBreaks });
        this.breaks = newBreaks;
      }
    },
    removeBreak(val) {
      const { breaks } = this;
      const newBreaks = breaks.filter((b) => b !== val);
      this.changeSettings({ breaks: newBreaks });
      this.breaks = newBreaks;
    },
    changeScoreEm(val) {
      this.changeSettings({ scoreEm: val });
      this.scoreEm = val;
    },
    changeDisEm(val) {
      this.changeSettings({ disEm: 2 - val });
      this.disEm = val;
    },
    changeTimeEm(val) {
      this.changeSettings({ timeEm: val });
      this.timeEm = val;
    },
    changePessi() {
      const { pessimistic } = this;
      this.changeSettings({ pessimistic: !pessimistic });
      this.pessimistic = !pessimistic;
    },
  },
};
</script>
