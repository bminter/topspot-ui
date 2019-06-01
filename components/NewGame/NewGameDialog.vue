<template>
  <v-dialog v-model="open" max-width="800px">
    <v-card>
      <v-layout justify-center align-center column>
        <v-card-title primary-title class="pb-0">
          <h1>New Game</h1>
        </v-card-title>
        <v-card-text>
          <v-stepper v-model="step" class="elevation-0">
            <v-stepper-items>
              <v-stepper-content step="1">
                <select-players
                  :winners.sync="winners"
                  :losers.sync="losers"
                  @go-to-next-step="step = 2"
                  :users="selectUsers"
                />
              </v-stepper-content>
              <v-stepper-content step="2">
                <score-input
                  :winner-score.sync="winnerScore"
                  :loser-score.sync="loserScore"
                  @go-to-next-step="step = 3"
                />
              </v-stepper-content>
              <v-stepper-content step="3">
                <review-game
                  :winners="winners"
                  :losers="losers"
                  :winner-score="winnerScore"
                  :loser-score="loserScore"
                  :loading="loading"
                  @go-to-next-step="createGame"
                />
              </v-stepper-content>
            </v-stepper-items>
            <v-stepper-header class="elevation-0 px-3">
              <v-stepper-step
                edit-icon="$vuetify.icons.complete"
                :editable="step > 1"
                :complete="step > 1"
                :step="1"
              >Players</v-stepper-step>
              <v-divider/>
              <v-stepper-step
                edit-icon="$vuetify.icons.complete"
                :editable="step > 2"
                :complete="step > 2"
                :step="2"
              >Score</v-stepper-step>
              <v-divider/>
              <v-stepper-step edit-icon="$vuetify.icons.complete" :step="3">Review</v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-card-text>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import SelectPlayers from '@/components/NewGame/SelectPlayers';
import ScoreInput from '@/components/NewGame/ScoreInput';
import ReviewGame from '@/components/NewGame/ReviewGame';
import insertGame from '@/apollo/mutations/insertGame';

export default {
  components: {
    SelectPlayers,
    ScoreInput,
    ReviewGame
  },
  props: {
    users: {
      type: Array,
      required: true
    },
    scoreboardId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      open: false,
      step: null,
      winners: [],
      losers: [],
      winnerScore: null,
      loserScore: null
    };
  },
  computed: {
    selectUsers () {
      return this.users.map(user => ({
        name: user.name || user.email,
        userId: user.userId
      }));
    }
  },
  methods: {
    show () {
      this.open = true;
    },
    cancel () {
      this.open = false;
    },
    async createGame () {
      try {
        this.loading = true;
        await this.$apollo.mutate({
          mutation: insertGame,
          variables: {
            winnerScore: this.winnerScore,
            loserScore: this.loserScore,
            scoreboardId: this.scoreboardId,
            userGameRecords: this.winners.map(winner => ({ userId: winner.userId, gameOutcome: 1 })).concat(this.losers.map(loser => ({ userId: loser.userId, gameOutcome: 2 })))
          }
        });
        this.$emit('gamecreated');
        this.open = false;
        this.step = 1;
        this.winners = [];
        this.losers = [];
        this.winnerScore = null;
        this.loserScore = null;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
