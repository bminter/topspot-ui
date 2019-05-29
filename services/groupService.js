import axios from 'axios';

function createGroup (userId, groupName) {
  return axios.post(`${process.env.VUE_APP_API_URL}/group`, {
    userId,
    groupName
  }, {
    headers: {
      Authorization: getAuth()
    }
  });
}

function joinGroup (userId, accessCode) {
  return axios.post(`${process.env.VUE_APP_API_URL}/groupMembership`, {
    userId,
    accessCode
  }, {
    headers: {
      Authorization: getAuth()
    }
  });
}

function getAuth () {
  if (localStorage) {
    return localStorage['auth._token.local'];
  }
}

export default {
  createGroup,
  joinGroup
};
