<template>
  <v-card class="text-xs-center">
    <v-card-title class="justify-center align-center">
      <h2>{{ title }}</h2>
    </v-card-title>
    <v-card-text>
      <span class="display-3">
        <b>{{ stat }}</b>
      </span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    stat: {
      type: String,
      required: true
    }
  }
};
</script>
