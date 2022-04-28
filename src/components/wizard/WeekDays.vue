<template>
  <v-row :no-gutters="isMobile">
    <v-col>
      <span v-if="!isMobile" class="overline">days</span>
        <v-chip-group :value="days" color="blue"
          mandatory multiple column @change="setDays">
          <v-chip v-for="name in dayNames" :key="name" :filter="!isMobile" outlined>
            {{ name }}
          </v-chip>
        </v-chip-group>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'WeekDays',
  data: () => ({
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  }),
  computed: {
    ...mapState('wizard', ['days']),
    ...mapState('settings', ['pessimistic']),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    setDays(val) {
      this.$store.commit('wizard/setDays', val);
    },
    changePessi() {
      const { pessimistic } = this;
      this.$store.commit('settings/set', { pessimistic: !pessimistic });
    },
  },
};
</script>
