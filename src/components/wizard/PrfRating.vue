<template>
  <v-col :cols="isMobile ? 12 : 6">
    <span v-if="!isMobile" class="overline">Reviews</span>
    <v-slider :min="0" :max="2" :step="0.5" color="blue lighten-3"
      :tick-labels="['reviews -', '', '', '', '+ reviews']"
      :prepend-icon="isMobile ? 'mdi-star' : null"
      :value="scoreEm" @change="changeScoreEm" />
  </v-col>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PrfRating',
  computed: {
    ...mapState('settings', ['scoreEm']),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    changeScoreEm(val) {
      this.$store.commit('settings/set', { scoreEm: val });
    },
  },
};
</script>
