<template>
  <v-container fill-height>
    <v-layout column>
      <div>
        <h1>Home</h1>
      </div>
      <v-layout fill-height column class="stat-row">
        <v-layout :column="!$vuetify.breakpoint.smAndUp" class="mt-2">
          <v-flex d-flex>
            <stat-card
              title="Record"
              :stat="`${wins} - ${losses}`"
              :class="$vuetify.breakpoint.smAndUp ? 'mr-2' : 'mb-2'"
            />
          </v-flex>
          <v-flex d-flex>
            <stat-card
              title="Win Percentage"
              :stat="winPercentage"
              :class="$vuetify.breakpoint.smAndUp ? 'mx-2' : 'mb-2'"
            />
          </v-flex>
          <v-flex d-flex>
            <stat-card
              title="Current Streak"
              :stat="currentStreak"
              :class="$vuetify.breakpoint.smAndUp ? 'ml-2' : 'mb-2'"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex d-flex>
            <activity-board :class="$vuetify.breakpoint.smAndUp ? 'mt-3' : 'mb-2'" :games="games"/>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import StatCard from '@/components/StatCard';
import ActivityBoard from '@/components/ActivityBoard';
import gameOutcome from '@/constants/gameOutcome';
import { getCurrentStreak, getWinPercentage } from '@/utils/calculator';
import { mapState } from 'vuex';

export default {
  middleware: 'isLoggedIn',
  layout: 'home',
  components: {
    StatCard,
    ActivityBoard
  },
  computed: {
    ...mapState('user', ['games']),
    wins () {
      return this.games.filter(game => !!game.userGameRecords.find(ugr => ugr.user.userId === this.$auth.user.userId && ugr.gameOutcome === gameOutcome.win)).length;
    },
    losses () {
      return this.games.filter(game => !!game.userGameRecords.find(ugr => ugr.user.userId === this.$auth.user.userId && ugr.gameOutcome === gameOutcome.loss)).length;
    },
    winPercentage () {
      return getWinPercentage(this.wins, this.losses);
    },
    currentStreak () {
      return getCurrentStreak(this.games.reduce((all, game) => all.concat(game.userGameRecords.map(ugr => ({ record: ugr, timeOfGame: game.timeOfGame }))), []).filter(ugr => ugr.record.user.userId === this.$auth.user.userId));
    }
  }
};
</script>

<style lang="scss" scoped>
.stat-row {
  max-height: 800px;
}
</style>
