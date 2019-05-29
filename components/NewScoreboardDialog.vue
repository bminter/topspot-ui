<template>
  <v-dialog v-model="open" max-width="600px">
    <v-card class="pa-2">
      <v-layout justify-center align-center column>
        <v-card-title primary-title>
          <span class="headline">New Scoreboard</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Scoreboard Name" color="secondary" v-model="name"/>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="createScoreboard" :loading="loading">Create</v-btn>
          <v-btn flat @click="cancel">Cancel</v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      open: false,
      activeTab: 1,
      name: '',
      loading: false
    };
  },
  methods: {
    show () {
      this.open = true;
    },
    cancel () {
      this.open = false;
    },
    async createScoreboard () {
      try {
        this.loading = true;
        await this.$store.dispatch('scoreboards/createScoreboard', { name: this.name });
        this.loading = false;
        this.open = false;
        this.name = '';
      } catch (error) {

      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
