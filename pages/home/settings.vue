<template>
  <v-container fluid fill-height>
    <v-layout column>
      <h1 class="mb-4">Settings</h1>
      <v-flex>
        <v-card class="pa-2">
          <v-card-title>
            <h2>Personal Information</h2>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Name" v-model="name"/>
              <v-text-field label="Email" v-model="email" disabled/>
              <v-layout justify-center>
                <v-btn class="secondary" :loading="loading" @click="updatePersonalInfo">Save</v-btn>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="showSuccessfulUpdate">User info successfully updated</v-snackbar>
  </v-container>
</template>

<script>
export default {
  middleware: 'isLoggedIn',
  layout: 'home',
  data () {
    return {
      name: this.$store.state.auth.user.name,
      email: this.$store.state.auth.user.email,
      loading: false,
      showSuccessfulUpdate: false
    };
  },
  methods: {
    async updatePersonalInfo () {
      try {
        this.loading = true;
        await this.$store.dispatch('user/updateUserInfo', {
          name: this.name
        });
        this.showSuccessfulUpdate = true;
      } catch (error) {

      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
