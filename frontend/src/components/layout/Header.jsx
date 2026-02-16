import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Brain, ChevronDown, User, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'

const navigation = [
  { name: 'Accueil', path: '/' },
  { name: 'Édition 2026', path: '/edition-2026' },
  { name: 'Bilan', path: '/bilan' },
  { name: 'Classement', path: '/classement' },
  { name: 'FAQ', path: '/faq' },
  { name: 'À propos', path: '/a-propos' },
  { name: 'Contact', path: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileMenuOpen(false) }, [location])

  const isHomePage = location.pathname === '/'
  const isDark = !isScrolled && isHomePage

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50' 
        : isHomePage ? 'bg-transparent' : 'bg-white border-b border-slate-200'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-white/20 backdrop-blur-sm' : 'bg-gradient-to-br from-primary-500 to-teal-500'
              }`}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className={`font-display text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Olympiades IA
                </span>
                <span className={`block text-xs font-medium ${isDark ? 'text-white/80' : 'text-primary-600'}`}>
                  Bénin 2026
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link key={item.path} to={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    location.pathname === item.path
                      ? isDark ? 'text-white bg-white/20' : 'text-primary-600 bg-primary-50'
                      : isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >{item.name}</Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                      {user?.name?.split(' ')[0] || 'Utilisateur'}
                    </span>
                    <ChevronDown className={`w-4 h-4 ${isUserMenuOpen ? 'rotate-180' : ''} ${isDark ? 'text-white/60' : 'text-slate-400'}`} />
                  </button>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                          <div className="p-3 border-b border-slate-100 bg-slate-50">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          </div>
                          <div className="p-2">
                            <Link to={isAdmin ? "/admin" : "/tableau-de-bord"} onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">
                              {isAdmin ? <Shield className="w-4 h-4 text-primary-500" /> : <LayoutDashboard className="w-4 h-4 text-primary-500" />}
                              {isAdmin ? 'Administration' : 'Tableau de bord'}
                            </Link>
                            <Link to="/profil" onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">
                              <User className="w-4 h-4 text-slate-400" />Mon profil
                            </Link>
                          </div>
                          <div className="p-2 border-t border-slate-100">
                            <button onClick={() => { logout(); setIsUserMenuOpen(false); }}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                              <LogOut className="w-4 h-4" />Se déconnecter
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/connexion" className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    isDark ? 'text-white/90 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                  }`}>Se connecter</Link>
                  <Link to="/inscription" className={`px-5 py-2.5 text-sm font-semibold rounded-lg ${
                    isDark ? 'bg-white text-primary-600 hover:bg-white/90' : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}>S'inscrire</Link>
                </>
              )}
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl z-50 lg:hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-display text-lg font-bold text-slate-900">Olympiades IA</span>
                    <span className="block text-xs text-primary-600">Bénin 2026</span>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4">
                {navigation.map((item) => (
                  <Link key={item.path} to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium mb-1 ${
                      location.pathname === item.path ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-100'
                    }`}>{item.name}</Link>
                ))}
                {isAuthenticated && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Link to={isAdmin ? "/admin" : "/tableau-de-bord"}
                      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl">
                      {isAdmin ? <Shield className="w-5 h-5 text-primary-500" /> : <LayoutDashboard className="w-5 h-5 text-primary-500" />}
                      {isAdmin ? 'Administration' : 'Tableau de bord'}
                    </Link>
                  </div>
                )}
              </nav>
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                {isAuthenticated ? (
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">
                    <LogOut className="w-4 h-4" />Se déconnecter
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/inscription" className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-primary-500 rounded-xl">
                      S'inscrire gratuitement
                    </Link>
                    <Link to="/connexion" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl">
                      Se connecter
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
