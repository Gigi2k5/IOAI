import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../../store/AuthContext'
import { Trophy, Clock, Target, TrendingUp, Download, Share2 } from 'lucide-react'
import api from '../../../services/api'

export default function ResultsPage() {
  const { user } = useAuth()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadResults = async () => {
      try {
        const response = await api.get('/qcm/result')
        if (response.data.success) {
          setResult(response.data.data)
        }
      } catch (error) {
        // Pas de résultat ou erreur - utiliser les données du contexte
        if (user?.candidate?.qcm_score) {
          setResult({
            score: user.candidate.qcm_score,
            correct_count: Math.round(user.candidate.qcm_score / 5),
            total_questions: 20,
            passed: true,
            duration_minutes: null
          })
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadResults()
  }, [user])
  
  const score = result?.score || user?.candidate?.qcm_score || 0
  const passed = result?.passed || user?.candidate?.qcm_passed

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-slate-500">Chargement des résultats...</p>
      </div>
    )
  }

  if (!passed && !result) {
    return (
      <div className="card p-8 text-center">
        <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="font-display text-xl font-semibold text-slate-900 mb-2">
          Aucun résultat disponible
        </h2>
        <p className="text-slate-500">
          Vous n'avez pas encore passé le QCM de sélection.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Mes Résultats</h1>
        <p className="text-slate-500">Détails de votre performance au QCM de sélection.</p>
      </motion.div>

      {/* Score principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card p-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute top-0 right-0 w-64 h-64 orb opacity-20 opacity-20" />
        
        <div className="relative">
          <Trophy className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl text-slate-500 mb-2">Votre score</h2>
          <div className="text-7xl font-display font-bold text-gradient mb-4">
            {score.toFixed(0)}%
          </div>
          <p className={`text-lg ${score >= 60 ? 'text-green-400' : 'text-orange-400'}`}>
            {score >= 80 ? '🏆 Excellent !' : score >= 60 ? '✅ Bon travail !' : '📚 À améliorer'}
          </p>
        </div>
      </motion.div>

      {/* Stats détaillées */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Target, label: 'Bonnes réponses', value: `${result?.correct_count || Math.round(score / 5)}/${result?.total_questions || 20}` },
          { icon: Clock, label: 'Temps utilisé', value: result?.duration_minutes ? `${Math.floor(result.duration_minutes)}:${String(Math.round((result.duration_minutes % 1) * 60)).padStart(2, '0')}` : '--:--' },
          { icon: TrendingUp, label: 'Statut', value: score >= (result?.passing_score || 50) ? 'Réussi ✓' : 'Non réussi' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="card p-4 text-center"
          >
            <stat.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Télécharger l'attestation
        </button>
        <button className="btn-ghost flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Partager
        </button>
      </motion.div>
    </div>
  )
}
