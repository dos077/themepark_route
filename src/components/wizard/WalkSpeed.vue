<template>
  <v-row :no-gutters="isMobile">
    <v-col :cols="isMobile ? 12 : 6">
      <span v-if="!isMobile" class="overline">Speed</span>
      <v-slider :min="3800" :max="7800" step="1000" color="blue lighten-3"
        :tick-labels="['loiter', 'slow', 'fast', 'jog', 'speed']"
        :prepend-icon="isMobile ? 'mdi-run-fast' : null"
        :value="speed" @change="changeSpeed" />
    </v-col>
    <v-col :cols="isMobile ? 12 : 6">
      <span v-if="!isMobile" class="overline">Distance</span>
      <v-slider :min="0" :max="2" :step="0.5" color="blue lighten-3"
        :tick-labels="['less walk', '', '', '', 'more walk']"
        :prepend-icon="isMobile ? 'mdi-map-marker-distance' : null"
        :value="2 - disEm" @change="changeDisEm" />
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'WeekDay',
  data: () => ({}),
  computed: {
    ...mapState('settings', ['speed', 'disEm']),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    changeSpeed(val) {
      this.$store.commit('settings/set', { speed: val });
    },
    changeDisEm(val) {
      this.$store.commit('settings/set', { disEm: 2 - val });
    },
  },
};
</script>
