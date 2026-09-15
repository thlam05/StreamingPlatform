const routeSegments = {
  forbidden: '403',
  login: 'login',
  register: 'register',
  settings: 'settings',
  studio: 'studio',
  studioStreamCreate: 'studio/streams/new',
  studioStreamDashboard: 'studio/streams/:streamId/dashboard',
  studioStreamSetup: 'studio/streams/:streamId/setup',
  studioStreamSummary: 'studio/streams/:streamId/summary',
  streamCreate: 'streams/new',
  streams: 'streams',
} as const

export const paths = {
  forbidden: `/${routeSegments.forbidden}`,
  home: '/',
  login: `/${routeSegments.login}`,
  register: `/${routeSegments.register}`,
  settings: `/${routeSegments.settings}`,
  studio: `/${routeSegments.studio}`,
  studioStreamCreate: `/${routeSegments.studioStreamCreate}`,
  studioStreamDashboard: (streamId: string) => `/studio/streams/${streamId}/dashboard`,
  studioStreamDashboardPattern: routeSegments.studioStreamDashboard,
  studioStreamSetup: (streamId: string) => `/studio/streams/${streamId}/setup`,
  studioStreamSetupPattern: routeSegments.studioStreamSetup,
  studioStreamSummary: (streamId: string) => `/studio/streams/${streamId}/summary`,
  studioStreamSummaryPattern: routeSegments.studioStreamSummary,
  streamCreate: `/${routeSegments.streamCreate}`,
  streamDetail: (streamId: string) => `/${routeSegments.streams}/${streamId}`,
  streams: `/${routeSegments.streams}`,
  streamsPattern: `${routeSegments.streams}/:streamId`,
} as const

export { routeSegments }
