<template>
  <v-card>
    <v-card-title>
      <h2>Activity</h2>
    </v-card-title>
    <v-list v-if="sortedGames.length" :two-line="!$vuetify.breakpoint.smAndUp">
      <v-list-tile v-for="game in sortedGames" :key="game.gameId">
        <v-list-tile-content v-html="getGameMessage(game)" class="pr-1"></v-list-tile-content>
        <v-list-tile-action-text>{{ moment(game.timeOfGame).format('MMMM Do YYYY, h:mm a') }}</v-list-tile-action-text>
      </v-list-tile>
    </v-list>
    <div class="text-xs-center headline pb-4" v-else>There are no recorded games</div>
  </v-card>
</template>

<script>
import gameOutcome from '@/constants/gameOutcome';
import moment from 'moment';
import { orderBy } from 'lodash';

export default {
  props: {
    userId: {
      type: Number,
      default: function () {
        return this.$auth.user.userId;
      }
    },
    games: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    moment,
    getGameMessage (game) {
      const winnerRecords = game.userGameRecords.filter(ugr => ugr.gameOutcome === gameOutcome.win);
      const loserRecords = game.userGameRecords.filter(ugr => ugr.gameOutcome === gameOutcome.loss);

      const winners = this.getUserGroupMessage(winnerRecords);
      const losers = this.getUserGroupMessage(loserRecords);

      return `<span>${winners} beat ${losers} by a score of ${game.winnerScore} - ${game.loserScore}</span>`;
    },
    getUserGroupMessage (records) {
      let toReturn = this.getUserName(records[0].user.userId === this.userId, records[0].user.name || records[0].user.email);

      for (let i = 1; i < records.length; i++) {
        let separator = i + 1 === records.length ? ' and ' : ', ';

        toReturn += `${separator} ${this.getUserName(records[0].user.userId === this.userId, records[0].user.name || records[0].user.email)}`;
      }

      return toReturn;
    },
    getUserName (isCurrentUser, userName) {
      return isCurrentUser ? `<b class="secondary--text">${userName}</b>` : `<b>${userName}</b>`;
    }
  },
  computed: {
    sortedGames () {
      return orderBy(this.games, ['timeOfGame', 'user'], ['desc']);
    }
  }
};
</script>
