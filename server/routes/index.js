module.exports = [
  {
    method: 'GET',
    path: '/token/:address',
    handler: 'webthreeAuth.authToken',
    config: {
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/authenticate/:address/:signature',
    handler: 'webthreeAuth.authenticate',
    config: {
      auth: false
    },
  },
]
