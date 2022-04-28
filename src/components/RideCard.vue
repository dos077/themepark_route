<template>
  <v-card outlined v-if="allExpand || expand">
    <v-img v-if="img" :src="img" max-height="10rem">
    </v-img>
    <v-card-title>
      {{ name }}
    </v-card-title>
    <v-card-text>
      <v-chip-group>
        <v-chip v-if="distance.length > 0"
          :color="disColor">
          {{ distance }}
        </v-chip>
        <v-chip :color="waitColor">
          {{ Math.round(item.wait * 60) }} min wait
        </v-chip>
        <v-chip v-if="score" outlined>
          {{ score }}/5
        </v-chip>
      </v-chip-group>
      <v-chip-group v-if="ages">
        <v-chip v-for="age in ages" :key="age"
          color="blue-grey darken-1" outlined>
          {{ age }}
        </v-chip>
      </v-chip-group>
      <v-chip-group v-if="types">
        <v-chip v-for="type in types" :key="type.text"
          :color="type.color + ' darken-3'" outlined dark>
          {{ type.text }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="!allExpand" plain @click="expand = false">
        <v-icon>mdi-close</v-icon>
        close
      </v-btn>
      <v-btn v-if="url" plain :href="url" color="blue" target="new">
        <v-icon>mdi-link</v-icon>
        official
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-list-item v-else link @click="expand = true">
    <v-progress-circular :value="disPer" :color="disColor" class="mr-2">
      <v-icon :color="disColor" dense>mdi-walk</v-icon>
    </v-progress-circular>
    <v-progress-circular  :value="waitPer" :color="waitColor" class="mr-2">
      <v-icon :color="waitColor" dense>mdi-clock</v-icon>
    </v-progress-circular>
      {{ name }}
  </v-list-item>
</template>

<script>
import rides from '../data/rides';
import ridesDb from '../data/ridesDb';

const info = require('../data/info.json');

const time2color = (hr) => {
  if (hr > 0.75) return 'red';
  if (hr > 0.5) return 'deep-orange';
  if (hr > 0.33) return 'amber';
  if (hr > 0.17) return 'lime';
  return 'green';
};

const m2FtOrMi = (m) => (m < 304
  ? `${Math.round((m * 3.2808) / 50) * 50} ft`
  : `${Math.round(m * 0.00621371 * 2) / 20} mi`);

export default {
  name: 'RideCard',
  props: ['item', 'allExpand'],
  data: () => ({ expand: false }),
  computed: {
    name() {
      if (!this.item.stay) return 'Break';
      const { id } = this.item;
      return rides.find((r) => r.id === id).name;
    },
    score() {
      if (!this.item.stay) return null;
      return ridesDb[this.item.id].score;
    },
    distance() {
      if (!this.item.stay) return '';
      const { distance } = this.item;
      return m2FtOrMi(distance);
    },
    disPer() {
      if (!this.item.stay) return 0;
      const { distance } = this.item;
      if (distance > 1000) return 100;
      return Math.round(distance / 10);
    },
    disColor() {
      if (!this.item.stay) return 'blue';
      const { distance } = this.item;
      if (distance > 750) return 'orange';
      if (distance > 600) return 'amber';
      if (distance > 310) return 'yellow';
      if (distance > 180) return 'lime';
      return 'green';
    },
    waitColor() {
      if (!this.item.stay) return 'blue';
      const { wait } = this.item;
      return time2color(wait);
    },
    waitPer() {
      if (!this.item.stay) return 0;
      const { wait } = this.item;
      if (wait > 1) return 100;
      return Math.round(wait * 100);
    },
    img() {
      if (!this.item.stay) return null;
      return info[this.item.id].img;
    },
    url() {
      if (!this.item.stay) return null;
      return info[this.item.id].url;
    },
    ages() {
      if (!this.item.stay) return null;
      const ageStr = info[this.item.id].age;
      if (ageStr.includes('All')) return ['All'];
      const ages = [];
      if (ageStr.includes('Preschool')) ages.push('Preschooler');
      if (ageStr.includes('Kids')) ages.push('Kids');
      if (ageStr.includes('Teens')) ages.push('Teens');
      if (ageStr.includes('Adults')) ages.push('Adults');
      return ages;
    },
    types() {
      if (!this.item.stay) return null;
      const str = info[this.item.id].type;
      const types = [];
      if (str.includes('Small')) {
        types.push({ color: 'cyan', text: 'small drops' });
      }
      if (str.includes('Slow')) {
        types.push({ color: 'teal', text: 'slow' });
      }
      if (str.includes('Spinning')) {
        types.push({ color: 'indigo', text: 'spinning' });
      }
      if (str.includes('Thrill')) {
        types.push({ color: 'red', text: 'thrill' });
      }
      if (str.includes('Loud')) {
        types.push({ color: 'yellow', text: 'loud' });
      }
      if (str.includes('Scary')) {
        types.push({ color: 'purple', text: 'scary' });
      }
      if (str.includes('Water')) {
        types.push({ color: 'blue', text: 'water' });
      }
      if (str.includes('Dark')) {
        types.push({ color: 'deep-purple', text: 'dark' });
      }
      return types;
    },
  },
};
</script>
