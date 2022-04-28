<template>
  <v-row :no-gutters="isMobile">
    <v-col :cols="isMobile ? 12 : 6">
      <span v-if="!isMobile" class="overline">Rides</span>
      <v-slider :min="0" :max="2" :step="0.5" ticks="always" color="blue lighten-3"
        :tick-labels="['Less', '', '', '', 'More']"
        :prepend-icon="isMobile ? 'mdi-map-marker-multiple' : null"
        :value="timeEm" @change="changeTimeEm" />
    </v-col>
    <v-col :cols="isMobile ? 12 : 6">
      <span v-if="!isMobile" class="overline">Breaks</span>
      <v-slider :min="2" :max="6" :step="1" ticks="always" color="blue lighten-3"
        :tick-labels="['1 hr', '', '2', '', '3']"
        :prepend-icon="isMobile ? 'mdi-coffee' : null"
        :value="breaksTarget" @change="setBreaksTarget" />
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'BreaksStops',
  computed: {
    ...mapState('settings', ['timeEm', 'breaks']),
    ...mapState('wizard', ['breaksTarget']),
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
    changeTimeEm(val) {
      this.$store.commit('settings/set', { timeEm: val });
    },
  },
};
</script>
