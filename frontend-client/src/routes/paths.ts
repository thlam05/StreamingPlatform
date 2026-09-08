const routeSegments = {
  forbidden: '403',
  login: 'login',
  register: 'register',
  settings: 'settings',
  streamCreate: 'streams/new',
  streams: 'streams',
} as const

export const paths = {
  forbidden: `/${routeSegments.forbidden}`,
  home: '/',
  login: `/${routeSegments.login}`,
  register: `/${routeSegments.register}`,
  settings: `/${routeSegments.settings}`,
  streamCreate: `/${routeSegments.streamCreate}`,
  streamDetail: (streamId: string) => `/${routeSegments.streams}/${streamId}`,
  streams: `/${routeSegments.streams}`,
  streamsPattern: `${routeSegments.streams}/:streamId`,
} as const

export { routeSegments }
