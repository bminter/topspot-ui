<template>
  <div>
    <v-app v-if="loading">
      <v-container fill-height>
        <v-progress-linear :indeterminate="true"></v-progress-linear>
      </v-container>
    </v-app>
    <v-app v-else>
      <v-navigation-drawer fixed v-model="drawer" app>
        <v-toolbar flat>
          <v-list>
            <v-list-tile>
              <v-list-tile-title class="title">TopSpot</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list class="pt-0">
          <template v-for="item in drawerItems">
            <v-list-tile :to="item.path" :key="item.title" exact v-if="!item.nestedItems">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-group :key="item.title" :value="true" no-action v-else>
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </template>
              <v-list-tile
                v-for="nestedItem in item.nestedItems"
                :key="nestedItem.title"
                :to="nestedItem.path"
              >
                <v-list-tile-title>{{ nestedItem.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list-group>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar class="primary elevation-3" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-menu v-if="groups.length > 1" open-on-hover>
            <template v-slot:activator="{ on }">
              <v-btn flat v-on="on">
                <v-icon>people</v-icon>
                <span class="ml-2">{{ currentGroup.name }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="group in groups"
                :key="group.groupId"
                @click="$store.dispatch('user/updateCurrentGroupId', { groupId: group.groupId })"
              >{{ group.name }}</v-list-tile>
            </v-list>
          </v-menu>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn dark icon v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-tile v-for="item in extraItems" :key="item.title" :to="item.path">
                <v-icon class="mr-2">{{ item.icon }}</v-icon>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <nuxt/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data () {
    return {
      loading: true,
      drawer: null,
      extraItems: [
        { title: 'Settings', icon: 'settings', path: '/home/settings' },
        { title: 'Logout', icon: 'exit_to_app' }
      ]
    };
  },
  async mounted () {
    this.loading = true;
    this.$store.dispatch('groups/getGroups');
    await this.$store.dispatch('user/getUserInfo');
    this.$store.dispatch('scoreboards/getScoreboards');
    this.loading = false;
  },
  computed: {
    ...mapState('user', ['scoreboardMemberships']),
    ...mapState('scoreboards', ['scoreboards']),
    ...mapState('groups', ['groups']),
    ...mapGetters('groups', ['currentGroup']),
    scoreboardNestedItems () {
      let scoreboardNestedItems = [];
      if (this.scoreboards && this.scoreboardMemberships) {
        scoreboardNestedItems = this.scoreboards.filter(sb => !!this.scoreboardMemberships.find(sbm => +sbm.scoreboardId === +sb.scoreboardId));
      }
      return scoreboardNestedItems.map(usb => ({
        title: usb.name,
        path: `/home/scoreboards/${usb.scoreboardId}`
      }));
    },
    drawerItems () {
      return [
        { title: 'Home', icon: 'home', path: '/home' },
        {
          title: 'Scoreboards',
          icon: 'dashboard',
          nestedItems: this.scoreboardNestedItems.concat([{ title: 'All Scoreboards', path: '/home/scoreboards/all' }])
        },
        { title: 'Groups', icon: 'people', path: '/home/groups' },
        { title: 'Settings', icon: 'settings', path: '/home/settings' }
      ];
    }
  }
};
</script>
