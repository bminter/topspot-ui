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
import { orderBy } from 'lodash';

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
  methods: {
    getCurrentStreak (records) {
      if (!records.length) return '-';
      const orderedRecords = orderBy(records, ['timeOfGame'], ['desc']);
      const lastGameOutcome = orderedRecords[0].record.gameOutcome;
      let count = 1;

      for (let i = 1; i < orderedRecords.length; i++) {
        if (orderedRecords[i].record.gameOutcome === lastGameOutcome) {
          count++;
        } else {
          break;
        }
      }
      return `${['', 'W', 'L'][lastGameOutcome]}${count}`;
    }
  },
  computed: {
    items () {
      if (!this.scoreboard.scoreboardMemberships) return [];

      const gameRecords = this.scoreboard.games.reduce((all, game) => all.concat(game.userGameRecords.map(ugr => ({ record: ugr, timeOfGame: game.timeOfGame }))), []);
      const users = this.scoreboard.scoreboardMemberships.map(sm => ({
        user: sm.user.name || sm.user.email,
        userId: sm.user.userId,
        wins: gameRecords.filter(ugr => ugr.record.user.userId === sm.user.userId && ugr.record.gameOutcome === 1).length,
        losses: gameRecords.filter(ugr => ugr.record.user.userId === sm.user.userId && ugr.record.gameOutcome === 2).length,
        currentStreak: this.getCurrentStreak(gameRecords.filter(ugr => ugr.record.user.userId === sm.user.userId))
      }));

      return users.map(user => ({
        ...user,
        winPercentage: user.losses === 0 ? Math.min(user.wins, 1) : user.wins / (user.wins + user.losses)
      }));
    }
  }
};
</script>
