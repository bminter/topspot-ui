<template>
  <v-card>
    <v-card-title>
      <h2>Leaderboard</h2>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :pagination.sync="pagination">
      <template v-slot:items="data">
        <td>{{ data.item.user}}</td>
        <td class="text-xs-center">{{ `${data.item.wins} - ${data.item.losses}` }}</td>
        <td class="text-xs-center">{{ data.item.winPercentage.toFixed(3) }}</td>
        <td class="text-xs-center">{{ data.item.currentStreak }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import gameOutcome from '@/constants/gameOutcome';
import { getCurrentStreak, getWinPercentage } from '@/utils/calculator';

export default {
  props: {
    sortBy: {
      type: String,
      default: null
    },
    sortDesc: {
      type: Boolean,
      default: false
    },
    scoreboard: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      headers: [
        { text: 'Player', align: 'left', sortable: true, value: 'user' },
        { text: 'Record', align: 'center', sortable: false, value: 'record' },
        { text: 'Win %', align: 'center', sortable: true, value: 'winPercentage' },
        { text: 'Current Streak', align: 'center', sortable: false, value: 'currentStreak' }
      ],
      pagination: {
        sortBy: this.sortBy,
        descending: this.sortDesc
      }
    };
  },
  computed: {
    items () {
      if (!this.scoreboard.scoreboardMemberships) return [];

      const gameRecords = this.scoreboard.games.reduce((all, game) => all.concat(game.userGameRecords.map(ugr => ({ record: ugr, timeOfGame: game.timeOfGame }))), []);
      const users = this.scoreboard.scoreboardMemberships.map(sm => ({
        user: sm.user.name || sm.user.email,
        userId: sm.user.userId,
        wins: gameRecords.filter(ugr => ugr.record.user.userId === sm.user.userId && ugr.record.gameOutcome === gameOutcome.win).length,
        losses: gameRecords.filter(ugr => ugr.record.user.userId === sm.user.userId && ugr.record.gameOutcome === gameOutcome.loss).length,
        currentStreak: getCurrentStreak(gameRecords.filter(ugr => ugr.record.user.userId === sm.user.userId))
      }));

      return users.map(user => ({
        ...user,
        winPercentage: getWinPercentage(user.wins, user.losses)
      }));
    }
  }
};
</script>
