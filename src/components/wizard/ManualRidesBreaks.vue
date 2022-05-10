<template>
  <v-col :cols="isMobile || listOn ? 12 : 6">
    <div class="overline">pick attractions</div>
    <v-btn v-if="!listOn" @click="listOn = true" plain color="blue" class="mx-2">
      list
    </v-btn>
    <v-chip-group v-if="listOn" :value="ridesOn" multiple column color="blue">
      <v-chip v-for="ride in rides" :key="ride.id" @click="toggleRide(ride)"
        outlined :filter="!isMobile">
        {{ ride.name }}
      </v-chip>
    </v-chip-group>
    <div v-if="listOn">
      <v-btn @click="listOn = false" plain color="red" class="mx-2">
        done
      </v-btn>
    </div>
  </v-col>
</template>

<script>
import { mapState } from 'vuex';
import ridesDb from '../../data/ridesDb';

const rides = [];
ridesDb.forEach((ride) => rides.push(ride));

export default {
  name: 'ManualRidesBreaks',
  data: () => ({
    listOn: false,
    rides,
  }),
  computed: {
    ...mapState('settings', ['noRides']),
    ridesOn() {
      const { noRides } = this;
      const arr = [];
      this.rides.forEach((r, i) => {
        if (!noRides.includes(r.id)) arr.push(i);
      });
      return arr;
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    toggleRide(ride) {
      let newList = [...this.noRides];
      if (newList.includes(ride.id)) {
        newList = this.noRides.filter((id) => id !== ride.id);
      } else {
        newList.push(ride.id);
      }
      this.$store.commit('settings/set', { noRides: newList });
    },
  },
};
</script>
