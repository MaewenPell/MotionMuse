export const environment = {
  production: false,
  auth0: {
    domain: 'dev-motion-muse.eu.auth0.com',
    clientId: 'oj5pBc8qWePzPF6as7LqApjBAZUB3UVV',
    authorizationParams: {
      audience: 'https://motion-muse',
      redirect_uri: 'http://localhost:4200/callback'
    },
    errorPath: '/error',
  },
  httpInterceptor: {
    allowedList: ['http://localhost:5000/api/*']
  },
  api: {
    serverUrl: 'http://localhost:5000',
  },
};