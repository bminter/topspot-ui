<template>
  <v-container>
    <v-layout row class="mb-2">
      <v-flex>
        <h1>Groups</h1>
      </v-flex>
      <v-flex class="text-xs-right">
        <v-btn flat icon color="secondary" @click="$refs.newGroupDialog.show()">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex v-if="loading">
        <v-layout class="mt-5" justify-center>
          <v-progress-circular indeterminate color="secondary"/>
        </v-layout>
      </v-flex>
      <v-flex v-else-if="groups.length">
        <groups-list title="All Groups" :groups="groups"/>
        <groups-list title="Created Groups" :groups="createdGroups"/>
      </v-flex>
      <v-flex v-else>
        <v-layout class="mt-5" justify-center align-center column>
          <v-icon size="200" color="secondary">people</v-icon>
          <p class="headline" color="secondary">You're not in any groups!</p>
          <v-btn @click="$refs.newGroupDialog.show()" class="secondary">Create Group</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <new-group-dialog ref="newGroupDialog"/>
  </v-container>
</template>

<script>
import NewGroupDialog from '@/components/NewGroupDialog';
import GroupsList from '@/components/GroupsList';
import { mapState } from 'vuex';

export default {
  middleware: 'isLoggedIn',
  layout: 'home',
  components: {
    NewGroupDialog,
    GroupsList
  },
  computed: {
    ...mapState('groups', ['groups', 'loading']),
    createdGroups () {
      return this.groups.filter(group => group.creator.userId === this.$auth.user.userId);
    }
  }
};
</script>
