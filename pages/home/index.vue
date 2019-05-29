<template>
  <v-container fluid fill-height>
    <v-layout column>
      <h1>Home</h1>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  middleware: 'isLoggedIn',
  layout: 'home',
  components: {
  }
};
</script>
