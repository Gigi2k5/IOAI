import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../store/AuthContext'
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password', '')

  const passwordChecks = [
    { label: 'Au moins 6 caractères', valid: password.length >= 6 },
    { label: 'Contient une lettre', valid: /[a-zA-Z]/.test(password) },
    { label: 'Contient un chiffre', valid: /\d/.test(password) },
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      })
      
      toast.success('Inscription réussie !')
      
      // Envoyer le code OTP et rediriger vers la page de vérification
      try {
        await api.post('/auth/send-otp')
      } catch (otpError) {
        console.log('OTP send error (may be expected if not configured):', otpError)
      }
      
      navigate('/verifier-email')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-deep-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative flex items-center justify-center w-full p-12">
          <div className="text-center text-white max-w-md">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Brain className="w-14 h-14 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">
              Rejoignez l'aventure
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Inscrivez-vous pour participer aux Olympiades Internationales d'IA 2026 et représenter le Bénin.
            </p>
            <div className="space-y-4 text-left">
              {['Inscription 100% gratuite', 'Formation par des experts', 'Opportunités internationales'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <CheckCircle className="w-5 h-5 text-light-300" />
                  <span className="text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-slate-900">Olympiades IA</span>
              <span className="block text-sm text-primary-600">Bénin 2026</span>
            </div>
          </Link>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
                Créer un compte
              </h1>
              <p className="text-slate-600">
                Commencez votre inscription aux Olympiades
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...register('firstName', { required: 'Requis' })}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                        errors.firstName ? 'border-red-300' : 'border-slate-200'
                      }`}
                      placeholder="Jean"
                    />
                  </div>
                  {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                  <input
                    {...register('lastName', { required: 'Requis' })}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                      errors.lastName ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="Dupont"
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'L\'email est requis',
                      pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' }
                    })}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                      errors.email ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="vous@exemple.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />{errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'Le mot de passe est requis',
                      minLength: { value: 6, message: 'Minimum 6 caractères' }
                    })}
                    className={`w-full pl-12 pr-12 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                      errors.password ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    {passwordChecks.map((check, i) => (
                      <p key={i} className={`text-xs flex items-center gap-1.5 ${check.valid ? 'text-green-600' : 'text-slate-400'}`}>
                        <CheckCircle className={`w-3.5 h-3.5 ${check.valid ? 'text-green-500' : 'text-slate-300'}`} />
                        {check.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register('terms', { required: true })}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <p className="text-sm text-slate-600">
                  J'accepte les{' '}
                  <Link to="/cgu" className="text-primary-600 hover:text-primary-700 font-medium">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link to="/confidentialite" className="text-primary-600 hover:text-primary-700 font-medium">
                    politique de confidentialité
                  </Link>
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-slate-500 bg-white">Déjà inscrit ?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link 
              to="/connexion"
              className="block w-full py-3 text-center text-primary-600 font-semibold border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 rounded-xl transition-all"
            >
              Se connecter
            </Link>
          </div>

          {/* Back to home */}
          <p className="text-center mt-6 text-sm text-slate-500">
            <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Retour à l'accueil
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
