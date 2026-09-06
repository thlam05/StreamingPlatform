const routeSegments = {
  forbidden: '403',
  login: 'login',
  register: 'register',
  settings: 'settings',
  streams: 'streams',
} as const

export const paths = {
  forbidden: `/${routeSegments.forbidden}`,
  home: '/',
  login: `/${routeSegments.login}`,
  register: `/${routeSegments.register}`,
  settings: `/${routeSegments.settings}`,
  streamDetail: (streamId: string) => `/${routeSegments.streams}/${streamId}`,
  streams: `/${routeSegments.streams}`,
  streamsPattern: `${routeSegments.streams}/:streamId`,
} as const

export { routeSegments }
