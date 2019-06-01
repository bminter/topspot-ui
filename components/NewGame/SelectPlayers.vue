<template>
  <div>
    <v-layout class="mb-4">
      <v-flex class="text-xs-center px-4" xs6>
        <h2>Winners</h2>
        <v-select
          :value="winners"
          @input="$emit('update:winners', $event)"
          :items="winnerUsers"
          item-text="name"
          return-object
          :menu-props="{ maxHeight: '400' }"
          label="Winners"
          multiple
          hint="Select Winners"
          persistent-hint
        ></v-select>
      </v-flex>
      <v-flex class="text-xs-center px-4" xs6>
        <h2>Losers</h2>
        <v-select
          :value="losers"
          @input="$emit('update:losers', $event)"
          :items="loserUsers"
          item-text="name"
          return-object
          item-value="userId"
          :menu-props="{ maxHeight: '400' }"
          label="Losers"
          multiple
          hint="Select Losers"
          persistent-hint
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-btn
        class="secondary"
        @click="$emit('go-to-next-step')"
        :disabled="winners.length === 0 || losers.length === 0"
      >Next</v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      default: () => []
    },
    winners: {
      type: Array,
      default: () => []
    },
    losers: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    winnerUsers () {
      return this.users.filter(user => !this.losers.find(loser => loser.userId === user.userId));
    },
    loserUsers () {
      return this.users.filter(user => !this.winners.find(winner => winner.userId === user.userId));
    }
  }
};
</script>
