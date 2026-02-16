import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

// Loader animé
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 
                    flex items-center justify-center shadow-lg"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
        <p className="text-slate-500 font-medium">Chargement...</p>
      </motion.div>
    </div>
  )
}

// Route protégée (authentification requise)
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />
  }

  return children
}
