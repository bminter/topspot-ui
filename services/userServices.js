import axios from 'axios';

function register (email, password) {
  return axios.post(`${process.env.VUE_APP_API_URL}/users/register`, {
    Email: email,
    Password: password
  }, {
    Authorization: getAuth()
  });
}

function getAuth () {
  return localStorage['auth._token.local'];
}
export default {
  register
};
