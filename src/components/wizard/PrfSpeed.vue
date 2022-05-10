<template>
  <v-col :cols="isMobile ? 12 : 6">
    <span v-if="!isMobile" class="overline">Speed</span>
    <v-slider :min="3800" :max="7800" step="1000" color="blue lighten-3"
      :tick-labels="['loiter', 'slow', 'fast', 'jog', 'speed']"
      :prepend-icon="isMobile ? 'mdi-run-fast' : null"
      :value="speed" @change="changeSpeed" />
  </v-col>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PrfSpeed',
  computed: {
    ...mapState('settings', ['speed']),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    changeSpeed(val) {
      this.$store.commit('settings/set', { speed: val });
    },
  },
};
</script>
