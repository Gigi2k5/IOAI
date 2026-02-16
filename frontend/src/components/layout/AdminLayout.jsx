import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Users, FileQuestion, LogOut, Menu, X, 
  Shield, BarChart3, FileText, ChevronRight, Bell, Settings
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'

const sidebarLinks = [
  { name: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
  { name: 'Candidats', path: '/admin/candidats', icon: Users },
  { name: 'Questions QCM', path: '/admin/questions', icon: FileQuestion },
  { name: 'Contenu', path: '/admin/contenu', icon: FileText },
  { name: 'Statistiques', path: '/admin/statistiques', icon: BarChart3 },
]

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const currentPage = sidebarLinks.find(l => l.path === location.pathname) || sidebarLinks[0]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-slate-900 z-40">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white">Admin</span>
              <span className="block text-xs text-primary-400">Olympiades IA</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === link.path
                  ? 'bg-primary-500/20 text-primary-400 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
              {location.pathname === link.path && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold">{user?.name?.charAt(0) || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-50 flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-white">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            <Bell className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)} 
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
            />
            <motion.aside
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-slate-900 z-50 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-white">Admin</span>
                    <span className="block text-xs text-primary-400">Olympiades IA</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {sidebarLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      location.pathname === link.path
                        ? 'bg-primary-500/20 text-primary-400 font-medium'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-slate-800">
                <button 
                  onClick={() => { logout(); setIsMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="hidden lg:flex h-16 items-center justify-between px-8 bg-white border-b border-slate-200">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{currentPage.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <Settings className="w-5 h-5" />
            </button>
            <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Voir le site →
            </Link>
          </div>
        </div>

        <div className="pt-16 lg:pt-0 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
