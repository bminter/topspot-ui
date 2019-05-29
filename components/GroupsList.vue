<template>
  <v-card class="mb-4">
    <v-card-title>
      <h3>{{ title }}</h3>
    </v-card-title>
    <v-expansion-panel>
      <v-expansion-panel-content v-for="group in groups" :key="group.groupId">
        <template v-slot:header>
          <div>{{ group.name }}</div>
        </template>
        <v-card class="pa-2">
          <v-card-text>
            <h4>Creator: {{ group.creator.name || group.creator.email }}</h4>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    groups: {
      type: Array,
      required: true
    }
  }
};
</script>
