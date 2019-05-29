import insertScoreboard from '@/apollo/mutations/insertScoreboard';
import insertScoreboardMembership from '@/apollo/mutations/insertScoreboardMembership';
import getScoreboards from '@/apollo/queries/getScoreboards';

export const state = () => ({
  loading: true,
  scoreboards: []
});

export const actions = {
  async createScoreboard ({ rootState, dispatch }, { name }) {
    await this.app.apolloProvider.defaultClient.mutate({
      mutation: insertScoreboard,
      variables: {
        name,
        groupId: rootState.user.currentGroupId,
        creatorId: rootState.auth.user.userId
      }
    });

    dispatch('getScoreboards');
    dispatch('user/getUserInfo', null, { root: true });
  },
  async getScoreboards ({ rootState, commit }) {
    commit('setLoading', true);
    const response = await this.app.apolloProvider.defaultClient.query({
      query: getScoreboards,
      variables: {
        groupId: rootState.user.currentGroupId
      },
      fetchPolicy: 'no-cache'
    });

    commit('setScoreboards', response.data.scoreboards);
    commit('setLoading', false);
  },
  async joinScoreboard ({ rootState, dispatch }, { scoreboardId }) {
    await this.app.apolloProvider.defaultClient.mutate({
      mutation: insertScoreboardMembership,
      variables: {
        userId: rootState.auth.user.userId,
        scoreboardId
      }
    });
    dispatch('user/getUserInfo', null, { root: true });
  }
};

export const mutations = {
  setLoading (state, loading) {
    state.loading = loading;
  },
  setScoreboards (state, scoreboards) {
    state.scoreboards = scoreboards;
  }
};

export const getters = {
  getScoreboard: (state) => (scoreboardId) => {
    return state.scoreboards.find(scoreboard => scoreboard.scoreboardId === scoreboardId) || {};
  }
};
