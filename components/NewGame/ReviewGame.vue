<template>
  <div>
    <v-layout class="mb-4">
      <v-flex class="text-xs-center px-4" xs6>
        <span class="display-3 font-weight-bold">{{ winnerScore }}</span>
        <p v-for="winner in winners" :key="winner.userId">{{ winner.name }}</p>
      </v-flex>
      <v-flex>
        <span class="display-3 font-weight-bold">-</span>
      </v-flex>
      <v-flex class="text-xs-center px-4" xs6>
        <span class="display-3 font-weight-bold">{{ loserScore }}</span>
        <p v-for="loser in losers" :key="loser.userId">{{ loser.name }}</p>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-btn class="secondary" @click="$emit('go-to-next-step')" :loading="loading">Submit</v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    winnerScore: {
      type: Number,
      default: null
    },
    loserScore: {
      type: Number,
      default: null
    },
    winners: {
      type: Array,
      default: () => []
    },
    losers: {
      type: Array,
      default: () => []
    }
  }
};
</script>
