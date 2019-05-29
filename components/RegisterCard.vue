<template>
  <v-card class="elevation-12" min-width="100%">
    <div class="elevation-0 text-xs-center pt-4" color="white">
      <v-toolbar-title>Begin Keeping Score in Seconds</v-toolbar-title>
    </div>
    <v-card-text>
      <v-form ref="registerForm" v-model="valid">
        <v-text-field
          prepend-icon="person"
          name="email"
          label="Email"
          type="text"
          color="secondary"
          :rules="[rules.required, rules.email, rules.exists]"
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
          :rules="[rules.required, rules.min]"
          validate-on-blur
          v-model="password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-layout column align-center>
        <v-flex>
          <v-btn color="secondary" @click="register" :loading="loading">Create Account</v-btn>
        </v-flex>
        <v-flex class="my-2">
          Already have an account?
          <a href="/login">Login</a>
        </v-flex>
      </v-layout>
    </v-card-actions>
    <v-snackbar v-model="showEmailExists" color="error">Email already exists</v-snackbar>
  </v-card>
</template>
<script>
import validateEmail from '@/mixins/validateEmail';

export default {
  name: 'RegisterCard',
  mixins: [validateEmail],
  data () {
    return {
      loading: false,
      email: 'test@test.com',
      password: 'passwords',
      rules: {
        required: value => !!value || 'Required',
        email: value => this.validateEmail(value) || 'Invalid email',
        min: value => value.length >= 8 || 'Min 8 characters',
        exists: value => (this.existingEmail === null || this.existingEmail !== value) || 'Email already exists'
      },
      valid: true,
      existingEmail: null,
      showEmailExists: false
    };
  },
  methods: {
    async register () {
      if (!this.valid) {
        this.$refs.registerForm.validate();
        return;
      }

      try {
        this.loading = true;
        await this.$store.dispatch('user/register', {
          email: this.email,
          password: this.password
        });
      } catch (error) {
        if (error.response.status === 409) {
          this.showEmailExists = true;
          this.existingEmail = this.email;
          this.$refs.registerForm.validate();
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
