<template>
  <v-card>
    <v-card-title>
      <h2>Activity</h2>
    </v-card-title>
    <v-list v-if="sortedGames.length">
      <v-list-tile v-for="game in sortedGames" :key="game.gameId">
        <v-list-tile-content v-html="getGameMessage(game)"></v-list-tile-content>
        <v-list-tile-action-text>{{ moment(game.timeOfGame).format('MMMM Do YYYY, h:mm a') }}</v-list-tile-action-text>
      </v-list-tile>
    </v-list>
    <div class="text-xs-center headline pb-4" v-else>There are no recorded games</div>
  </v-card>
</template>

<script>
import moment from 'moment';
import { orderBy } from 'lodash';

export default {
  props: {
    games: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    moment,
    getGameMessage (game) {
      const winnerRecords = game.userGameRecords.filter(ugr => ugr.gameOutcome === 1);
      const loserRecords = game.userGameRecords.filter(ugr => ugr.gameOutcome === 2);

      const winners = this.getUserGroupMessage(winnerRecords);
      const losers = this.getUserGroupMessage(loserRecords);

      return `<span>${winners} beat ${losers} by a score of ${game.winnerScore} - ${game.loserScore}</span>`;
    },
    getUserGroupMessage (records) {
      let toReturn = `<b>${records[0].user.name || records[0].user.email}</b>`;

      for (let i = 1; i < records.length; i++) {
        let separator = i + 1 === records.length ? ' and ' : ', ';
        toReturn += `${separator} <b>${records[i].user.name || records[i].user.email}</b>`;
      }

      return toReturn;
    }
  },
  computed: {
    sortedGames () {
      return orderBy(this.games, ['timeOfGame', 'user'], ['desc']);
    }
  }
};
</script>
