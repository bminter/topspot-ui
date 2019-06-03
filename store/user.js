import userServices from '@/services/userServices';
import updateUserInfo from '@/apollo/mutations/updateUserInfo';
import updateCurrentGroupId from '@/apollo/mutations/updateCurrentGroupId';
import getUserInfo from '@/apollo/queries/getUserInfo';

const Cookie = process.client ? require('js-cookie') : undefined;

export const state = () => ({
  currentGroupId: null,
  scoreboardMemberships: [],
  games: []
});

export const actions = {
  async register (_, { email, password }) {
    try {
      await userServices.register(email, password);
      this.$router.push({ path: '/login' });
    } catch (error) {
      throw error;
    }
  },
  async login (_, { email, password }) {
    try {
      await this.$auth.loginWith('local', {
        data: {
          email,
          password
        }
      });
      Cookie.set('auth', this.$auth.state);
    } catch (error) {
      await this.$auth.logout();
      Cookie.set('auth', false);
      throw error;
    }
  },
  async updateUserInfo ({ rootState }, { name }) {
    await this.app.apolloProvider.defaultClient.mutate({
      mutation: updateUserInfo,
      variables: {
        userId: rootState.auth.user.userId,
        name
      }
    });
    await this.$auth.fetchUser();
    Cookie.set('auth', this.$auth.state);
  },
  async getUserInfo ({ rootState, commit, dispatch }) {
    const response = await this.app.apolloProvider.defaultClient.query({
      query: getUserInfo,
      variables: {
        userId: rootState.auth.user.userId
      },
      fetchPolicy: 'no-cache'
    });
    const user = response.data.users_by_pk;
    if (!user.currentGroupId && rootState.groups.groups.length) {
      dispatch('updateCurrentGroupId', { groupId: rootState.groups.groups[0].groupId });
    }
    commit('setCurrentGroupId', user.currentGroupId);
    commit('setScoreboardMemberships', user.scoreboardMemberships);
    commit('setGames', response.data.games);
  },
  updateCurrentGroupId ({ rootState, commit, dispatch }, { groupId }) {
    commit('setCurrentGroupId', groupId);
    this.app.apolloProvider.defaultClient.mutate({
      mutation: updateCurrentGroupId,
      variables: {
        userId: rootState.auth.user.userId,
        groupId
      }
    });
    dispatch('scoreboards/getScoreboards', null, { root: true });
    this.$router.push({ path: '/home' });
  }
};

export const mutations = {
  setCurrentGroupId (state, currentGroupId) {
    state.currentGroupId = currentGroupId;
  },
  setScoreboardMemberships (state, scoreboardMemberships) {
    state.scoreboardMemberships = scoreboardMemberships;
  },
  setGames (state, games) {
    state.games = games;
  }
};

export const getters = {
  isUserInScoreboard: (state) => (scoreboardId) => {
    return !!state.scoreboardMemberships.find(sbm => sbm.scoreboardId === scoreboardId);
  }
};
