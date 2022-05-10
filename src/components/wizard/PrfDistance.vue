<template>
  <v-col :cols="isMobile ? 12 : 6">
    <span v-if="!isMobile" class="overline">Distance</span>
    <v-slider :min="0" :max="2" :step="0.5" color="blue lighten-3"
      :tick-labels="['walk -', '', '', '', '+ walk']"
      :prepend-icon="isMobile ? 'mdi-map-marker-distance' : null"
      :value="2 - disEm" @change="changeDisEm" />
  </v-col>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PrfDistance',
  computed: {
    ...mapState('settings', ['disEm']),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    changeDisEm(val) {
      this.$store.commit('settings/set', { disEm: 2 - val });
    },
  },
};
</script>
