<template>
  <v-container>
    <v-layout row class="mb-2">
      <v-flex>
        <h1>All Scoreboards</h1>
      </v-flex>
      <v-flex class="text-xs-right">
        <v-btn
          flat
          icon
          color="secondary"
          @click="$refs.newScoreboardDialog.show()"
          v-if="atLeastOneGroupExists"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex v-if="!atLeastOneGroupExists">
        <v-layout class="mt-5" justify-center align-center column>
          <v-icon size="200" color="secondary">dashboard</v-icon>
          <p class="headline" color="secondary">To join a scoreboard, you must first be in a group!</p>
          <v-btn to="/home/groups" class="secondary">Go to Groups</v-btn>
        </v-layout>
      </v-flex>
      <v-flex v-else-if="!scoreboards.length">
        <v-layout class="mt-5" justify-center align-center column>
          <v-icon size="200" color="secondary">dashboard</v-icon>
          <p class="headline" color="secondary">There are currently no scoreboards in your group</p>
          <v-btn class="secondary" @click="$refs.newScoreboardDialog.show()">Create a scoreboard</v-btn>
        </v-layout>
      </v-flex>
      <v-flex v-else-if="loading">
        <v-layout class="mt-5" justify-center>
          <v-progress-circular indeterminate color="secondary"/>
        </v-layout>
      </v-flex>
      <v-flex v-else>
        <v-card class="mb-4">
          <v-list>
            <v-list-tile
              v-for="scoreboard in scoreboards"
              :key="scoreboard.scoreobardId"
              :to="`/home/scoreboards/${scoreboard.scoreboardId}`"
            >
              <v-list-tile-content>{{ scoreboard.name }}</v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <new-scoreboard-dialog ref="newScoreboardDialog"/>
  </v-container>
</template>

<script>
import NewScoreboardDialog from '@/components/NewScoreboardDialog';
import { mapState } from 'vuex';

export default {
  middleware: 'isLoggedIn',
  layout: 'home',
  components: {
    NewScoreboardDialog
  },
  computed: {
    ...mapState({
      atLeastOneGroupExists: state => !!state.groups.groups.length,
      scoreboards: state => state.scoreboards.scoreboards,
      loading: state => state.scoreboards.loading
    })
  }
};
</script>
