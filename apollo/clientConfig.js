const cookieparser = process.server ? require('cookieparser') : undefined;

export default function ({ req }) {
  let auth;
  if (process.client) {
    auth = localStorage['auth._token.local'];
  } else {
    const parsed = req.headers.cookie ? cookieparser.parse(req.headers.cookie) : '';
    auth = parsed['auth._token.local'];
  }

  return {
    httpEndpoint: 'http://localhost:8080/v1alpha1/graphql',
    getAuth: () => auth
  };
}
