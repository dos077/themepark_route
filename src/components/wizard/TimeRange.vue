<template>
  <v-row :no-gutters="isMobile">
    <v-col :cols="isMobile ? 12 : 6">
      <span v-if="!isMobile" class="overline">start</span>
      <v-slider :min="8" :max="12" step="1" color="blue lighten-3"
        :tick-labels="['8AM', 9, 10, 11, '12PM']" dense
        :prepend-icon="isMobile ? 'mdi-play-circle' : null"
        :value="startTime" @change="changeStartTime" />
    </v-col>
    <v-col :cols="isMobile ? 12 : 6">
      <span v-if="!isMobile" class="overline">end</span>
      <v-slider :min="18" :max="24" step="1" color="blue lighten-3"
        :tick-labels="['6PM', 7, 8, 9, 10, 11, 12]"
        :prepend-icon="isMobile ? 'mdi-stop-circle' : null"
        :value="endTime" @change="changeEndTime" />
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TimeRange',
  computed: {
    ...mapState('settings', ['startTime', 'endTime']),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    changeStartTime(val) {
      this.$store.commit('settings/set', { startTime: val });
    },
    changeEndTime(val) {
      this.$store.commit('settings/set', { endTime: val });
    },
  },
};
</script>
