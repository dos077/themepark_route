<template>
  <v-col :cols="isMobile ? 12 : 6">
    <span v-if="!isMobile" class="overline">end</span>
    <v-slider :min="18" :max="24" step="1" color="blue lighten-3"
      :tick-labels="['6PM', 7, 8, 9, 10, 11, 12]"
      :prepend-icon="isMobile ? 'mdi-stop-circle' : null"
      :value="endTime" @change="changeEndTime" />
  </v-col>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PrfEnd',
  computed: {
    ...mapState('settings', ['endTime']),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    changeEndTime(val) {
      this.$store.commit('settings/set', { endTime: val });
    },
  },
};
</script>
