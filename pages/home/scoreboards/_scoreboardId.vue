<template>
  <v-container>
    <v-layout row class="mb-2">
      <v-flex>
        <h1>{{ shallowScoreboard.name }}</h1>
      </v-flex>
      <v-flex class="text-xs-right">
        <v-btn color="secondary" @click="joinScoreboard" v-if="showJoinButton">Join</v-btn>
        <v-btn flat icon color="secondary" @click="$refs.newGameDialog.show()" v-else>
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex>
        <v-card class="mb-4">
          <v-card-title>
            <h2>Leaderboard</h2>
          </v-card-title>
          <v-data-table :headers="headers" :items="items" :pagination.sync="pagination">
            <template v-slot:items="data">
              <td>{{ data.item.user}}</td>
              <td class="text-xs-center">{{ `${data.item.wins} - ${data.item.losses}` }}</td>
              <td class="text-xs-center">{{ data.item.winPercentage.toFixed(3) }}</td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card class="mb-4">
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
      </v-flex>
    </v-layout>
    <new-game-dialog
      ref="newGameDialog"
      :users="users"
      :scoreboard-id="scoreboardId"
      @gamecreated="getDeepScoreboard"
    />
  </v-container>
</template>

<script>
import NewGameDialog from '@/components/NewGameDialog';
import getScoreboard from '@/apollo/queries/getScoreboard';
import moment from 'moment';
import { orderBy } from 'lodash';
import { mapGetters } from 'vuex';

export default {
  middleware: 'isLoggedIn',
  layout: 'home',
  components: {
    NewGameDialog
  },
  data () {
    return {
      loading: true,
      deepScoreboard: {},
      headers: [
        { text: 'Player', align: 'left', sortable: true, value: 'user' },
        { text: 'Record', align: 'center', sortable: false, value: 'record' },
        { text: 'Win %', align: 'center', sortable: true, value: 'winPercentage' }
      ],
      pagination: {
        sortBy: 'winPercentage',
        descending: true
      }
    };
  },
  mounted () {
    this.getDeepScoreboard();
  },
  methods: {
    moment,
    async getDeepScoreboard () {
      try {
        this.loading = true;
        const response = await this.$apollo.query({
          query: getScoreboard,
          variables: {
            scoreboardId: this.scoreboardId
          },
          fetchPolicy: 'no-cache'
        });
        this.deepScoreboard = response.data.scoreboards_by_pk;
      } catch (error) {

      } finally {
        this.loading = false;
      }
    },
    async joinScoreboard () {
      this.$store.dispatch('scoreboards/joinScoreboard', {
        scoreboardId: this.scoreboardId
      });
    },
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
    scoreboardId () {
      return +this.$route.params.scoreboardId;
    },
    ...mapGetters('scoreboards', ['getScoreboard']),
    ...mapGetters('user', ['isUserInScoreboard']),
    shallowScoreboard () {
      return this.getScoreboard(this.scoreboardId);
    },
    showJoinButton () {
      return !this.isUserInScoreboard(this.scoreboardId);
    },
    users () {
      if (this.deepScoreboard.scoreboardMemberships) {
        return this.deepScoreboard.scoreboardMemberships.map(sbm => sbm.user);
      }
      return [];
    },
    items () {
      if (!this.deepScoreboard.scoreboardMemberships) return [];

      const gameRecords = this.deepScoreboard.games.reduce((all, game) => all.concat(game.userGameRecords), []);

      const users = this.deepScoreboard.scoreboardMemberships.map(sm => ({
        user: sm.user.name || sm.user.email,
        userId: sm.user.userId,
        wins: gameRecords.filter(ugr => ugr.user.userId === sm.user.userId && ugr.gameOutcome === 1).length,
        losses: gameRecords.filter(ugr => ugr.user.userId === sm.user.userId && ugr.gameOutcome === 2).length
      }));

      return users.map(user => ({
        ...user,
        winPercentage: user.losses === 0 ? Math.min(user.wins, 1) : user.wins / (user.wins + user.losses)
      }));
    },
    sortedGames () {
      return orderBy(this.deepScoreboard.games, ['timeOfGame', 'user'], ['desc']);
    }
  }
};
</script>
