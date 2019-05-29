<template>
  <v-layout>
    <v-flex xs12>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <login-card/>
          <v-snackbar/>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import LoginCard from '@/components/LoginCard';

export default {
  components: {
    LoginCard
  }
};
</script>
