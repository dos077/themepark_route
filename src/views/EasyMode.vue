<template>
<v-container :class="{ 'pa-0': isMobile }">
  <v-toolbar v-if="path || isSaved" flat
    transition="slide-y-transition">
    <v-btn v-if="path" icon plain @click="$store.commit('toggleSetting')"
      transition="slide-y-transition">
      <v-icon>
        {{ settingOn ? 'mdi-map' : 'mdi-cog' }}
      </v-icon>
    </v-btn>
    <v-toolbar-title v-if="!settingOn && path"
      transition="slide-y-transition">
      {{ weekDay }}
    </v-toolbar-title>
    <v-spacer />
    <v-btn v-if="settingOn && isSaved" @click="loadRoute" icon color="red"
     transition="slide-y-transition">
      <v-icon>mdi-database-arrow-down</v-icon>
    </v-btn>
    <span v-if="!settingOn && path"
      transition="slide-y-transition">
      <v-btn icon color="green" @click="saveRoute">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn v-if="!allExpand" color="blue" icon
        @click="$store.commit('toggleExpand')">
        <v-icon>mdi-magnify-plus</v-icon>
      </v-btn>
      <v-btn v-if="allExpand" color="red" icon
        @click="$store.commit('toggleExpand')">
        <v-icon>mdi-magnify-minus</v-icon>
      </v-btn>
    </span>
  </v-toolbar>
  <v-divider />
  <v-row>
    <v-col>
      <v-window :value="settingOn ? 0 : 1" vertical touchless>
        <v-window-item>
          <easy-wiz />
        </v-window-item>
        <v-window-item>
          <time-line />
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
  <v-overlay :value="loading" opacity="8">
    {{ loadingMsg }}
    <v-progress-circular indeterminate class="ma-2" xs />
  </v-overlay>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
import EasyWiz from '../components/EasyWiz.vue';
import TimeLine from '../components/TimeLine.vue';

export default {
  name: 'EasyMode',
  components: { EasyWiz, TimeLine },
  data: () => ({ }),
  computed: {
    ...mapState(['path', 'details', 'loading', 'loadingMsg', 'settingOn', 'allExpand']),
    ...mapState('settings', ['dayOfWeek']),
    isSaved() {
      if (!localStorage || !localStorage.getItem('savedRoute')) return false;
      const saved = JSON.parse(localStorage.getItem('savedRoute'));
      return saved.path && saved.details;
    },
    weekDay() {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.dayOfWeek];
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    isDesktop() {
      return this.$vuetify.breakpoint.lgAndUp;
    },
  },
  watch: {
    path: {
      immediate: true,
      handler(to) {
        if (to && this.settingOn === true) { this.$store.commit('toggleSetting'); }
      },
    },
    isMobile: {
      immediate: true,
      handler(to) {
        if (to) {
          this.$store.commit('wizard/setThreads', 4);
          this.$store.commit('settings/set', { batchLimit: 8000 });
        } else {
          this.$store.commit('wizard/setThreads', 10);
          this.$store.commit('settings/set', { batchLimit: 12000 });
        }
      },
    },
  },
  methods: {
    loadRoute() {
      this.$store.commit('load');
    },
    saveRoute() {
      if (this.path) {
        const { details, path, dayOfWeek } = this;
        if (localStorage) {
          localStorage.setItem(
            'savedRoute',
            JSON.stringify({
              path, details, dayOfWeek,
            }),
          );
        }
      }
    },
  },
};
</script>
