import groupService from '@/services/groupService';
import getGroupMembershipsByUser from '@/apollo/queries/getGroupMembershipsByUser';
export const state = () => ({
  loading: true,
  groups: []
});

export const actions = {
  async createGroup ({ dispatch, rootState }, { name }) {
    const response = await groupService.createGroup(rootState.auth.user.userId, name);
    dispatch('user/updateCurrentGroupId', { groupId: response.data.groupId }, { root: true });
    await dispatch('getGroups');
  },
  async joinGroup ({ dispatch, rootState }, { accessCode }) {
    await groupService.joinGroup(rootState.auth.user.userId, accessCode);
    await dispatch('getGroups');
  },
  async getGroups ({ commit, rootState, dispatch }) {
    commit('setLoading', true);

    const response = await this.app.apolloProvider.defaultClient.query({
      query: getGroupMembershipsByUser,
      variables: {
        userId: rootState.auth.user.userId
      },
      fetchPolicy: 'no-cache'
    });

    const groups = response.data.groupMemberships.reduce((allGroups, groupMembership) => {
      allGroups.push(groupMembership.group);
      return allGroups;
    }, []);

    if (!rootState.user.currentGroupId && rootState.groups.length) {
      dispatch('updateCurrentGroupId', { groupId: rootState.groups.groups[0].groupId }, { root: true });
    }

    commit('setGroups', groups);
    commit('setLoading', false);
  }
};

export const mutations = {
  setGroups (state, groups) {
    state.groups = groups;
  },
  setLoading (state, loading) {
    state.loading = loading;
  }
};

export const getters = {
  currentGroup (state, _, rootState) {
    return state.groups.find(group => group.groupId === rootState.user.currentGroupId);
  }
};
