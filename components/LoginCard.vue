<template>
  <v-card class="elevation-12" width="100%" max-width="600px">
    <div class="elevation-0 text-xs-center pt-4" color="white">
      <v-toolbar-title>Login</v-toolbar-title>
    </div>
    <v-card-text>
      <v-form ref="loginForm">
        <v-text-field
          prepend-icon="person"
          name="email"
          label="Email"
          type="text"
          color="secondary"
          :rules="[rules.required]"
          validate-on-blur
          v-model="email"
        ></v-text-field>
        <v-text-field
          id="password"
          prepend-icon="lock"
          name="password"
          label="Password"
          type="password"
          color="secondary"
          :rules="[rules.required]"
          validate-on-blur
          v-model="password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-layout column align-center>
        <v-flex>
          <v-btn color="secondary" @click="login" :loading="loading">Login</v-btn>
        </v-flex>
        <v-flex class="my-2">
          Don't have an account?
          <a href="/">Sign Up</a>
        </v-flex>
      </v-layout>
    </v-card-actions>
    <v-snackbar v-model="showInvalidLogin" color="error">Invalid login</v-snackbar>
  </v-card>
</template>
<script>
export default {
  name: 'LoginCard',
  data () {
    return {
      loading: false,
      email: 'test@test.com',
      password: 'passwords',
      rules: {
        required: value => !!value || 'Required'
      },
      showInvalidLogin: false
    };
  },
  methods: {
    async login () {
      try {
        this.loading = true;
        await this.$store.dispatch('user/login', {
          email: this.email,
          password: this.password
        });
      } catch (error) {
        if (error.response.status === 401) {
          this.showInvalidLogin = true;
        } else {
          throw error;
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
