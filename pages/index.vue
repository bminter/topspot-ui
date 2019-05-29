<template>
  <v-layout>
    <v-flex xs12 sm6 class="hidden-xs-only"></v-flex>
    <v-flex xs12 sm6>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <register-card/>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import RegisterCard from '@/components/RegisterCard';

export default {
  components: {
    RegisterCard
  }
};
</script>
