<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',

  data: () => ({
    //
  }),
  computed: {
    ...mapState(['settingOn', 'path']),
  },
};
</script>
