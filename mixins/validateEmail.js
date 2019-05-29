export default {
  methods: {
    validateEmail (value) {
      // eslint-disable-next-line no-useless-escape
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return emailRegex.test(String(value).toLowerCase());
    }
  }
};
