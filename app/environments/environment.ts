const isLocalDevelopmentHost =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const environment = {
  production: true,
  apiUrl: isLocalDevelopmentHost ? 'http://localhost:3000/api' : '/api',
};
