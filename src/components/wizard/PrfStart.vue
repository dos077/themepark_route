<template>
  <v-col :cols="isMobile ? 12 : 6">
    <span v-if="!isMobile" class="overline">start</span>
    <v-slider :min="8" :max="12" step="1" color="blue lighten-3"
      :tick-labels="['8AM', 9, 10, 11, '12PM']" dense
      :prepend-icon="isMobile ? 'mdi-play-circle' : null"
      :value="startTime" @change="changeStartTime" />
  </v-col>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PrfStart',
  computed: {
    ...mapState('settings', ['startTime']),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    changeStartTime(val) {
      this.$store.commit('settings/set', { startTime: val });
    },
  },
};
</script>
