import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const password = watch('password')

  // Rediriger si pas de token
  useEffect(() => {
    if (!token) {
      toast.error('Lien de réinitialisation invalide')
      navigate('/connexion', { replace: true })
    }
  }, [token, navigate])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await api.post('/auth/reset-password', {
        token: token,
        new_password: data.password
      })

      if (response.data.success) {
        setIsSuccess(true)
        toast.success('Mot de passe réinitialisé avec succès')
        
        // Redirection après 3 secondes
        setTimeout(() => {
          navigate('/connexion', { replace: true })
        }, 3000)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la réinitialisation'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#206080]/10 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-[#206080]" />
                </div>
                <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  Nouveau mot de passe
                </h1>
                <p className="text-slate-500">
                  Choisissez un nouveau mot de passe sécurisé pour votre compte.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-slate-300 focus:border-[#206080] focus:ring-[#206080]/20'
                      } focus:outline-none focus:ring-4 transition-all`}
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Le mot de passe est requis',
                        minLength: {
                          value: 8,
                          message: 'Le mot de passe doit contenir au moins 8 caractères'
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-slate-300 focus:border-[#206080] focus:ring-[#206080]/20'
                      } focus:outline-none focus:ring-4 transition-all`}
                      placeholder="••••••••"
                      {...register('confirmPassword', {
                        required: 'Veuillez confirmer le mot de passe',
                        validate: (value) =>
                          value === password || 'Les mots de passe ne correspondent pas'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Password requirements */}
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">
                    Le mot de passe doit contenir au moins 8 caractères.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#206080] text-white font-semibold rounded-xl hover:bg-[#185068] focus:outline-none focus:ring-4 focus:ring-[#206080]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Réinitialiser le mot de passe'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#008040]/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-[#008040]" />
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  Mot de passe réinitialisé !
                </h2>
                <p className="text-slate-500 mb-6">
                  Votre mot de passe a été modifié avec succès. 
                  Vous allez être redirigé vers la page de connexion...
                </p>
                <Link
                  to="/connexion"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#206080] text-white font-semibold rounded-xl hover:bg-[#185068] transition-colors"
                >
                  Se connecter maintenant
                </Link>
              </div>
            </>
          )}

          {/* Back to login (only show if not success) */}
          {!isSuccess && (
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <Link
                to="/connexion"
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#206080] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          )}

          {/* Token expired message */}
          {!isSuccess && (
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">
                Le lien expire au bout d'1 heure.{' '}
                <Link to="/mot-de-passe-oublie" className="text-[#206080] hover:underline">
                  Demander un nouveau lien
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
