export const environment = {
  production: false,
  auth0: {
    domain: 'dev-motion-muse.eu.auth0.com',
    clientId: 'oj5pBc8qWePzPF6as7LqApjBAZUB3UVV',
    authorizationParams: {
      redirect_uri: 'http://localhost:4200/callback',
    },
    errorPath: '/error',
  },
  api: {
    serverUrl: 'http://localhost:5073',
  },
};
