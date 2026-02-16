import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Users, FileQuestion, CheckCircle, Clock, XCircle, TrendingUp,
  ChevronRight, UserPlus, FileText, Award, BarChart3
} from 'lucide-react'
import api from '../../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/dashboard')
        setStats(res.data.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { 
      title: 'Total Candidats', 
      value: stats?.candidates?.total || 0, 
      icon: Users, 
      color: 'primary',
      change: '+12%'
    },
    { 
      title: 'En attente', 
      value: stats?.candidates?.by_status?.submitted || 0, 
      icon: Clock, 
      color: 'amber',
      change: null
    },
    { 
      title: 'Validés', 
      value: stats?.candidates?.by_status?.validated || 0, 
      icon: CheckCircle, 
      color: 'green',
      change: null
    },
    { 
      title: 'QCM Complétés', 
      value: stats?.qcm?.completed || 0, 
      icon: FileText, 
      color: 'teal',
      change: null
    },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-slate-600">
          Vue d'ensemble des candidatures et statistiques
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                stat.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                stat.color === 'green' ? 'bg-green-100 text-green-600' :
                'bg-teal-100 text-teal-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.change && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl lg:text-3xl font-display font-bold text-slate-900 mb-1">
              {stat.value.toLocaleString('fr-FR')}
            </p>
            <p className="text-sm text-slate-500">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h2 className="font-display font-bold text-slate-900 mb-6">Actions rapides</h2>
          <div className="space-y-3">
            {[
              { title: 'Gérer les candidats', desc: 'Valider ou rejeter les candidatures', icon: Users, path: '/admin/candidats', color: 'primary' },
              { title: 'Gérer les questions', desc: 'Ajouter ou modifier les questions QCM', icon: FileQuestion, path: '/admin/questions', color: 'teal' },
              { title: 'Voir les statistiques', desc: 'Rapports et analyses détaillées', icon: BarChart3, path: '/admin/statistiques', color: 'accent' },
            ].map((action) => (
              <Link 
                key={action.title}
                to={action.path}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  action.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  action.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                  'bg-accent-100 text-accent-600'
                }`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{action.title}</p>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h2 className="font-display font-bold text-slate-900 mb-6">Résumé QCM</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-accent-500" />
                <span className="text-slate-700">Score moyen</span>
              </div>
              <span className="font-bold text-slate-900">{stats?.qcm?.average_score?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700">Taux de réussite</span>
              </div>
              <span className="font-bold text-slate-900">{stats?.qcm?.pass_rate?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary-500" />
                <span className="text-slate-700">Candidats par genre</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-500">H: {stats?.candidates?.by_gender?.M || 0}</span>
                <span className="mx-2 text-slate-300">|</span>
                <span className="text-sm text-slate-500">F: {stats?.candidates?.by_gender?.F || 0}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <Link 
              to="/admin/statistiques"
              className="flex items-center justify-center gap-2 w-full py-3 text-primary-600 font-medium hover:bg-primary-50 rounded-xl transition-colors"
            >
              Voir toutes les statistiques
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
