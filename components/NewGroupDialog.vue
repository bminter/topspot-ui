<template>
  <v-dialog v-model="open" max-width="600px">
    <v-card>
      <v-card-title primary-title>
        <span class="headline">New Group</span>
      </v-card-title>
      <v-card-text>
        <v-tabs fixed-tabs v-model="activeTab" slider-color="secondary">
          <v-tab>Create a Group</v-tab>
          <v-tab>Join a Group</v-tab>
          <v-tab-item>
            <v-card flat>
              <v-layout justify-center align-center column>
                <v-card-text>
                  <v-text-field label="Group Name" color="secondary" v-model="createGroupName"/>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="secondary" @click="createGroup" :loading="createGroupLoading">Create</v-btn>
                  <v-btn flat @click="cancel">Cancel</v-btn>
                </v-card-actions>
              </v-layout>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-layout justify-center align-center column>
                <v-card-text>
                  <v-text-field label="Group Code" color="secondary" v-model="accessCode"/>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="secondary" @click="joinGroup" :loading="joinGroupLoading">Join</v-btn>
                  <v-btn flat @click="cancel">Cancel</v-btn>
                </v-card-actions>
              </v-layout>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      open: false,
      activeTab: 1,
      createGroupLoading: false,
      createGroupName: '',
      joinGroupLoading: false,
      accessCode: ''
    };
  },
  methods: {
    show () {
      this.activeTab = 0;
      this.open = true;
    },
    async createGroup () {
      try {
        this.createGroupLoading = true;
        this.$store.dispatch('groups/createGroup', { name: this.createGroupName });
        this.open = false;
      } catch (error) {
        throw error;
      } finally {
        this.createGroupLoading = false;
      }
    },
    async joinGroup () {
      try {
        this.joinGroupLoading = true;
        await this.$store.dispatch('groups/joinGroup', { accessCode: this.accessCode });
        this.open = false;
      } catch (error) {
        throw error;
      } finally {
        this.joinGroupLoading = false;
      }
    },
    cancel () {
      this.open = false;
      this.createGroupName = '';
      this.accessCode = '';
    }
  }
};
</script>
