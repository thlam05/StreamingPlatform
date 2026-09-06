import { Outlet } from 'react-router-dom'

import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-ink-950 text-copy lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
