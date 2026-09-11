import { createBrowserRouter } from 'react-router-dom'

import { AuthLayout } from '../layouts/AuthLayout'
import { MainLayout } from '../layouts/MainLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ForbiddenPage } from '../pages/ForbiddenPage'
import { HomePage } from '../pages/HomePage/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { SettingsPage } from '../pages/SettingsPage'
import { StreamDetailPage } from '../pages/streams/StreamDetailPage'
import { StreamListPage } from '../pages/streams/StreamListPage'
import { StreamSetupPage } from '../pages/streams/StreamSetupPage'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { paths, routeSegments } from './paths'

export const router = createBrowserRouter([
  {
    children: [
      { index: true, element: <HomePage /> },
      { path: routeSegments.streams, element: <StreamListPage /> },
      {
        path: routeSegments.streamCreate,
        element: (
          <ProtectedRoute>
            <StreamSetupPage />
          </ProtectedRoute>
        ),
      },
      { path: paths.streamsPattern, element: <StreamDetailPage /> },
      { path: routeSegments.settings, element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
    element: <MainLayout />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        children: [
          { path: routeSegments.login, element: <LoginPage /> },
          { path: routeSegments.register, element: <RegisterPage /> },
        ],
        element: <AuthLayout />,
      },
    ],
  },
  { element: <ForbiddenPage />, path: routeSegments.forbidden },
])
