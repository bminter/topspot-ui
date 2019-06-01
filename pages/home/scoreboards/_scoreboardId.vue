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
      <v-flex class="mb-4">
        <leader-board :scoreboard="deepScoreboard" sort-by="winPercentage" sort-desc/>
      </v-flex>
      <v-flex>
        <activity-board :games="deepScoreboard.games"/>
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
import NewGameDialog from '@/components/NewGame/NewGameDialog';
import getScoreboard from '@/apollo/queries/getScoreboard';
import ActivityBoard from '@/components/ActivityBoard';
import LeaderBoard from '@/components/LeaderBoard';
import { mapGetters } from 'vuex';

export default {
  middleware: 'isLoggedIn',
  layout: 'home',
  components: {
    NewGameDialog,
    ActivityBoard,
    LeaderBoard
  },
  data () {
    return {
      loading: true,
      deepScoreboard: {}
    };
  },
  mounted () {
    this.getDeepScoreboard();
  },
  methods: {
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
    }
  }
};
</script>
