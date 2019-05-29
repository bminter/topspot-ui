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
                <v-layout class="mb-4">
                  <v-flex class="text-xs-center px-4" xs6>
                    <h2>Winners</h2>
                    <v-select
                      v-model="winners"
                      :items="selectUsers"
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
                      v-model="losers"
                      :items="selectUsers"
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
                    @click="step = 2"
                    :disabled="winners.length === 0 || losers.length === 0"
                  >Next</v-btn>
                </v-layout>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-layout class="mb-4">
                  <v-flex class="text-xs-center px-4" xs6>
                    <h2>Winning Score</h2>
                    <v-text-field
                      label="Winning Score"
                      @keypress="isNumber($event)"
                      type="number"
                      v-model.number="winnerScore"
                    />
                  </v-flex>
                  <v-flex class="text-xs-center px-4" xs6>
                    <h2>Losing Score</h2>
                    <v-text-field
                      label="Losing Score"
                      @keypress="isNumber($event)"
                      type="number"
                      v-model.number="loserScore"
                    />
                  </v-flex>
                </v-layout>
                <v-layout justify-center>
                  <v-btn
                    class="secondary"
                    @click="step = 3"
                    :disabled="!winnerScore || !loserScore"
                  >Next</v-btn>
                </v-layout>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-layout class="mb-4">
                  <v-flex class="text-xs-center px-4" xs6>
                    <span class="display-3 font-weight-bold">{{ winnerScore }}</span>
                    <p v-for="winner in winners" :key="winner.userId">{{ winner.name }}</p>
                  </v-flex>
                  <v-flex>
                    <span class="display-3 font-weight-bold">-</span>
                  </v-flex>
                  <v-flex class="text-xs-center px-4" xs6>
                    <span class="display-3 font-weight-bold">{{ loserScore }}</span>
                    <p v-for="loser in losers" :key="loser.userId">{{ loser.name }}</p>
                  </v-flex>
                </v-layout>
                <v-layout justify-center>
                  <v-btn class="secondary" @click="createGame" :loading="loading">Submit</v-btn>
                </v-layout>
              </v-stepper-content>
            </v-stepper-items>
            <v-stepper-header class="elevation-0 px-3">
              <v-stepper-step
                edit-icon="$vuetify.icons.complete"
                :editable="step > 1"
                :complete="step > 1"
                :step="1"
              >Players</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                edit-icon="$vuetify.icons.complete"
                :editable="step > 2"
                :complete="step > 2"
                :step="2"
              >Score</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step edit-icon="$vuetify.icons.complete" :step="3">Review</v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-card-text>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import insertGame from '@/apollo/mutations/insertGame';

export default {
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
    isNumber (event) {
      if (parseInt(event.key)) {
        return true;
      }

      event.preventDefault();
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
