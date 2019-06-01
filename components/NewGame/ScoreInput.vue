<template>
  <div>
    <v-layout class="mb-4">
      <v-flex class="text-xs-center px-4" xs6>
        <h2>Winning Score</h2>
        <v-text-field
          label="Winning Score"
          @keypress="isNumber($event)"
          type="number"
          :value="winnerScore"
          @input="$emit('update:winnerScore', parseInt($event))"
        />
      </v-flex>
      <v-flex class="text-xs-center px-4" xs6>
        <h2>Losing Score</h2>
        <v-text-field
          label="Losing Score"
          @keypress="isNumber($event)"
          type="number"
          :value="loserScore"
          @input="$emit('update:loserScore', parseInt($event))"
        />
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-btn
        class="secondary"
        @click="$emit('go-to-next-step')"
        :disabled="winnerScore === null || loserScore === null"
      >Next</v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    winnerScore: {
      type: Number,
      default: null
    },
    loserScore: {
      type: Number,
      default: null
    }
  },
  methods: {
    isNumber (event) {
      if (parseInt(event.key)) {
        return true;
      }

      event.preventDefault();
    }
  }
};
</script>
