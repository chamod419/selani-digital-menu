import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  LayoutDashboard,
  Layers3,
  UtensilsCrossed,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const { admin, logout } = useAuth()

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Categories',
      path: '/admin/categories',
      icon: Layers3,
    },
    {
      label: 'Menu Items',
      path: '/admin/menu-items',
      icon: UtensilsCrossed,
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login', {
      replace: true,
    })
  }

  const navigateTo = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }

    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-[270px] border-r border-white/[0.06] bg-[#0d0d0d] lg:flex lg:flex-col">
        <div className="flex h-24 items-center border-b border-white/[0.06] px-7">
          <img
            src="/images/selani-logo.png"
            alt="Selani"
            className="h-14 w-auto object-contain"
          />
        </div>

        <div className="px-5 py-7">
          <p className="px-3 text-[9px] uppercase tracking-[0.3em] text-white/20">
            Menu Management
          </p>

          <nav className="mt-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigateTo(item.path)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm transition ${
                    active
                      ? 'bg-[#d7b56d] font-semibold text-black'
                      : 'text-white/45 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/[0.06] p-5">
          <button
            type="button"
            onClick={() => window.open('/', '_blank')}
            className="mb-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/40 transition hover:bg-white/[0.04] hover:text-white"
          >
            <ExternalLink size={17} />
            View Customer Menu
          </button>

          <div className="mb-4 rounded-2xl bg-white/[0.03] p-4">
            <p className="text-sm text-white">
              {admin?.name}
            </p>

            <p className="mt-1 truncate text-xs text-white/25">
              {admin?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-300/70 transition hover:bg-red-500/[0.06] hover:text-red-300"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0b0b0b]/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-[74px] items-center justify-between px-5">
          <img
            src="/images/selani-logo.png"
            alt="Selani"
            className="h-11 w-auto"
          />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] text-white/60"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute bottom-0 right-0 top-0 w-[290px] border-l border-white/[0.08] bg-[#101010] p-5">
            <div className="flex items-center justify-between">
              <img
                src="/images/selani-logo.png"
                alt="Selani"
                className="h-12 w-auto"
              />

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08]"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-10 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)

                return (
                  <button
                    key={item.path}
                    onClick={() => navigateTo(item.path)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm ${
                      active
                        ? 'bg-[#d7b56d] font-semibold text-black'
                        : 'text-white/50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="absolute bottom-6 left-5 right-5 flex items-center gap-3 rounded-2xl bg-red-500/[0.06] px-4 py-3.5 text-sm text-red-300"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen lg:ml-[270px]">
        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout