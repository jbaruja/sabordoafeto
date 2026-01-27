'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Heart,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Produtos', href: '/admin/produtos', icon: Package },
  { name: 'Carrinhos', href: '/admin/carrinhos', icon: ShoppingCart },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setUserEmail(session.user.email || '')
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-neutral-snow">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-text-primary/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-glass-white backdrop-blur-lg border-r border-primary-sage/10 shadow-soft
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-primary-sage/10">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 group"
            >
              <Heart className="w-6 h-6 text-secondary-rose fill-current" />
              <div>
                <h2 className="font-primary text-lg font-light text-text-primary">
                  <span className="text-secondary-rose">Sabor</span> do Afeto
                </h2>
                <p className="font-secondary text-xs text-text-secondary">
                  Admin
                </p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-modern font-secondary text-sm
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-secondary-rose text-white shadow-soft'
                        : 'text-text-primary hover:bg-primary-sage-light/10 hover:text-secondary-rose'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info & Logout */}
          <div className="p-4 border-t border-primary-sage/10 space-y-3">
            {userEmail && (
              <div className="px-4 py-2 bg-primary-sage-light/10 rounded-modern">
                <p className="font-secondary text-xs text-text-secondary mb-1">
                  Logado como:
                </p>
                <p className="font-secondary text-sm text-text-primary truncate">
                  {userEmail}
                </p>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-2 border-text-light text-text-secondary hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-glass-white/80 backdrop-blur-lg border-b border-primary-sage/10 shadow-soft">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text-primary hover:text-secondary-rose"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-primary text-2xl font-light text-text-primary">
              {navigation.find((item) => item.href === pathname)?.name ||
                'Admin'}
            </h1>
            <div className="w-6 lg:hidden" /> {/* Spacer for mobile */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
