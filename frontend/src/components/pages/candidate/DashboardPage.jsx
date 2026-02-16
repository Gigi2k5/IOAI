import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, FileText, Award, ChevronRight, Clock, CheckCircle, 
  AlertCircle, Calendar, ArrowRight, Target, TrendingUp, AlertTriangle, Mail
} from 'lucide-react'
import { useAuth } from '../../../store/AuthContext'
import api from '../../../services/api'

const statusConfig = {
  draft: { label: 'Brouillon', color: 'slate', icon: Clock, message: 'Complétez votre profil pour continuer' },
  submitted: { label: 'En attente', color: 'amber', icon: Clock, message: 'Votre profil est en cours de validation' },
  validated: { label: 'Validé', color: 'green', icon: CheckCircle, message: 'Vous pouvez passer le QCM' },
  rejected: { label: 'Refusé', color: 'red', icon: AlertCircle, message: 'Votre profil a été refusé' },
}

export default function DashboardPage() {
  const { user, isVerified } = useAuth()
  const [profile, setProfile] = useState(null)
  const [qcmStatus, setQcmStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, qcmRes] = await Promise.all([
          api.get('/candidate/profile'),
          api.get('/qcm/status').catch(() => ({ data: { data: null } }))
        ])
        setProfile(profileRes.data.data)
        setQcmStatus(qcmRes.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  const status = profile?.status || 'draft'
  const config = statusConfig[status]
  const progress = status === 'draft' ? 25 : status === 'submitted' ? 50 : status === 'validated' ? 75 : 100

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Email Verification Alert */}
      {!isVerified && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-amber-800">
                Votre adresse email n'est pas encore vérifiée
              </p>
              <p className="text-sm text-amber-600">
                Vérifiez votre email pour pouvoir soumettre votre profil
              </p>
            </div>
          </div>
          <Link
            to="/verifier-email"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            Vérifier maintenant
          </Link>
        </motion.div>
      )}

      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 mb-2">
          Bonjour, {user?.name?.split(' ')[0] || 'Candidat'} 👋
        </h1>
        <p className="text-slate-600">
          Bienvenue sur votre espace de candidature aux Olympiades IA 2026
        </p>
      </motion.div>

      {/* Status Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`mb-8 p-6 rounded-2xl border-2 ${
          config.color === 'green' ? 'bg-green-50 border-green-200' :
          config.color === 'amber' ? 'bg-amber-50 border-amber-200' :
          config.color === 'red' ? 'bg-red-50 border-red-200' :
          'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            config.color === 'green' ? 'bg-green-100 text-green-600' :
            config.color === 'amber' ? 'bg-amber-100 text-amber-600' :
            config.color === 'red' ? 'bg-red-100 text-red-600' :
            'bg-slate-100 text-slate-600'
          }`}>
            <config.icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                config.color === 'green' ? 'bg-green-100 text-green-700' :
                config.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                config.color === 'red' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {config.label}
              </span>
            </div>
            <p className="text-slate-700 font-medium">{config.message}</p>
          </div>
          {status === 'draft' && (
            <Link to="/profil">
              <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg flex items-center gap-2 transition-colors">
                Compléter le profil
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}
          {status === 'validated' && !qcmStatus?.has_completed && (
            <Link to="/qcm">
              <button className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-lg flex items-center gap-2 transition-colors">
                Passer le QCM
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Progression</span>
            <span className="font-semibold text-slate-900">{progress}%</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                config.color === 'green' ? 'bg-green-500' :
                config.color === 'amber' ? 'bg-amber-500' :
                config.color === 'red' ? 'bg-red-500' :
                'bg-primary-500'
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { 
            title: 'Mon Profil', 
            desc: 'Gérez vos informations personnelles', 
            icon: User, 
            path: '/profil',
            color: 'primary'
          },
          { 
            title: 'Test QCM', 
            desc: qcmStatus?.has_completed ? 'QCM terminé' : 'Passez le test de sélection', 
            icon: FileText, 
            path: '/qcm',
            color: 'teal',
            disabled: status !== 'validated' || qcmStatus?.has_completed
          },
          { 
            title: 'Résultats', 
            desc: qcmStatus?.has_completed ? `Score: ${qcmStatus?.score}%` : 'Consultez vos résultats', 
            icon: Award, 
            path: '/resultats',
            color: 'accent',
            disabled: !qcmStatus?.has_completed
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Link 
              to={item.disabled ? '#' : item.path}
              className={`block p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                item.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                item.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                'bg-accent-100 text-accent-600'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-primary-600">
                Accéder <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <h2 className="font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          Prochaines étapes
        </h2>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Inscription', date: '24 Fév - 9 Mars', done: true },
            { step: 2, title: 'Validation profil', date: 'Sous 48h', done: status !== 'draft' },
            { step: 3, title: 'Test QCM', date: '15 Mars', done: qcmStatus?.has_completed },
            { step: 4, title: 'Résultats', date: 'Avril', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                item.done 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {item.done ? <CheckCircle className="w-4 h-4" /> : item.step}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${item.done ? 'text-slate-900' : 'text-slate-500'}`}>
                  {item.title}
                </p>
              </div>
              <span className="text-sm text-slate-400">{item.date}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
