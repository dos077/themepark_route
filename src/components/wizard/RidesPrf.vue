<template>
  <v-row :no-gutters="isMobile">
    <v-col :cols="isMobile ? 12 : 6">
      <span v-if="!isMobile" class="overline">Reviews</span>
      <v-slider :min="0" :max="2" :step="0.5" color="blue lighten-3"
        :tick-labels="['no concern', '', '', '', 'very important']"
        :prepend-icon="isMobile ? 'mdi-star' : null"
        :value="scoreEm" @change="changeScoreEm" />
    </v-col>
    <v-col :cols="isMobile ? 12 : 6">
      <span v-if="!isMobile" class="overline">types</span>
      <v-chip-group v-model="typeSelected" multiple mandatory column color="blue">
        <v-chip v-for="type in types" :key="type" :filter="!isMobile" outlined>
          {{ type }}
        </v-chip>
      </v-chip-group>
    </v-col>
    <v-col v-if="excluded && excluded.length > 0" cols="12">
      <v-alert class="mt-3"
        color="red lighten-4" border="left" colored-borde outlined>
        <div class="overline mb-2">excluded rides</div>
        <v-chip v-for="ride in excluded" :key="ride.id"
          outlined close class="mr-2 mb-2"
          @click:close="removeNoRide(ride)" @click="removeNoRide(ride)">
          {{ ride.name }}
        </v-chip>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import ridesDb, { findTypeRides } from '../../data/ridesDb';

export default {
  name: 'RidesPrf',
  data: () => ({
    types: ['small drops', 'slow', 'spinning', 'thrill', 'loud', 'scary', 'water', 'dark'],
    typeSelected: [0, 1, 2, 3, 4, 5, 6, 7],
  }),
  computed: {
    ...mapState('settings', ['scoreEm', 'noRides']),
    excluded() {
      if (!this.noRides || this.noRides.length === 0) return null;
      return this.noRides.map((id) => ({ id, name: ridesDb[id].name }));
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  watch: {
    typeSelected(to) {
      if (to && to.length < 8) {
        const filters = this.types.filter((t, i) => !to.includes(i));
        const noRides = [];
        filters.forEach((type) => {
          noRides.push(...findTypeRides(type));
        });
        this.$store.commit('settings/set', { noRides });
      } else {
        this.$store.commit('settings/set', { noRides: [] });
      }
    },
  },
  methods: {
    changeScoreEm(val) {
      this.$store.commit('settings/set', { scoreEm: val });
    },
    removeNoRide(ride) {
      const noRides = this.noRides.filter((id) => id !== ride.id);
      this.$store.commit('settings/set', { noRides });
    },
  },
};
</script>
