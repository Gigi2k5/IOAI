import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Lazy loading des composants pour éviter les erreurs de chargement
const EditionSelector = lazy(() => import('./bilan/EditionSelector'))
const Edition2024 = lazy(() => import('./bilan/Edition2024'))
const Edition2025 = lazy(() => import('./bilan/Edition2025'))
const Edition2026 = lazy(() => import('./bilan/Edition2026'))
const AboutIOAI = lazy(() => import('./bilan/AboutIOAI'))

const editions = {
  2024: Edition2024,
  2025: Edition2025,
  2026: Edition2026
}

// Composant de chargement
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )
}

export default function BilanPage() {
  const { year } = useParams()
  const navigate = useNavigate()
  
  // Déterminer l'année active (défaut: 2025)
  const initialYear = year ? parseInt(year) : 2025
  const [activeYear, setActiveYear] = useState(
    [2024, 2025, 2026].includes(initialYear) ? initialYear : 2025
  )

  // Synchroniser l'URL avec l'année active
  useEffect(() => {
    if (year && parseInt(year) !== activeYear) {
      const parsedYear = parseInt(year)
      if ([2024, 2025, 2026].includes(parsedYear)) {
        setActiveYear(parsedYear)
      }
    }
  }, [year, activeYear])

  const handleYearChange = (newYear) => {
    setActiveYear(newYear)
    navigate(`/bilan/${newYear}`, { replace: true })
  }

  // Composant de l'édition active
  const EditionComponent = editions[activeYear]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-deep-500 to-teal-600 py-20 md:py-28">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Bilan des{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-200">
                éditions
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12">
              Retour sur les Olympiades Internationales d'Intelligence Artificielle 
              depuis leur création en 2024
            </p>

            {/* Edition Selector */}
            <Suspense fallback={<LoadingSpinner />}>
              <EditionSelector 
                activeYear={activeYear} 
                onYearChange={handleYearChange} 
              />
            </Suspense>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-2.5 bg-white/50 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Edition Content */}
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <EditionComponent />
            </motion.div>
          </AnimatePresence>
        </Suspense>

        {/* Separator */}
        <div className="my-16 md:my-24 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <span className="text-sm text-slate-400 font-medium">À propos de l'IOAI</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>

        {/* About IOAI Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <AboutIOAI />
        </Suspense>
      </main>

      {/* Quick Navigation - Fixed on scroll */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2">
            <div className="flex gap-1">
              {[2024, 2025, 2026].map((y) => (
                <button
                  key={y}
                  onClick={() => handleYearChange(y)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeYear === y
                      ? 'bg-primary-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
