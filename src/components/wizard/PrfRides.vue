<template>
  <v-col :cols="isMobile ? 12 : 6">
    <span v-if="!isMobile" class="overline">Rides</span>
    <v-slider :min="0" :max="2" :step="0.5" ticks="always" color="blue lighten-3"
      :tick-labels="['rides -', '', '', '', '+ rides']"
      :prepend-icon="isMobile ? 'mdi-map-marker-multiple' : null"
      :value="timeEm" @change="changeTimeEm" />
  </v-col>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PrfRides',
  computed: {
    ...mapState('settings', ['timeEm']),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    changeTimeEm(val) {
      this.$store.commit('settings/set', { timeEm: val });
    },
  },
};
</script>
