import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [devToken, setDevToken] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm()

  // Cooldown timer
  const startCooldown = () => {
    setCooldown(30)
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await api.post('/auth/forgot-password', {
        email: data.email
      })

      if (response.data.success) {
        setIsSubmitted(true)
        startCooldown()
        
        // En dev, afficher le token
        if (response.data.dev_token) {
          setDevToken(response.data.dev_token)
        }
      }
    } catch (error) {
      // Même en cas d'erreur, on affiche le message de succès pour ne pas révéler si l'email existe
      setIsSubmitted(true)
      startCooldown()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    
    try {
      setIsLoading(true)
      const response = await api.post('/auth/forgot-password', {
        email: getValues('email')
      })

      if (response.data.success) {
        toast.success('Email renvoyé')
        startCooldown()
        
        if (response.data.dev_token) {
          setDevToken(response.data.dev_token)
        }
      }
    } catch (error) {
      toast.success('Email renvoyé')
      startCooldown()
    } finally {
      setIsLoading(false)
    }
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
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#206080]/10 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-[#206080]" />
                </div>
                <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  Mot de passe oublié ?
                </h1>
                <p className="text-slate-500">
                  Entrez votre adresse email et nous vous enverrons un lien de réinitialisation.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-slate-300 focus:border-[#206080] focus:ring-[#206080]/20'
                      } focus:outline-none focus:ring-4 transition-all`}
                      placeholder="vous@exemple.com"
                      {...register('email', {
                        required: 'L\'email est requis',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Adresse email invalide'
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#206080] text-white font-semibold rounded-xl hover:bg-[#185068] focus:outline-none focus:ring-4 focus:ring-[#206080]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer le lien
                    </>
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
                  Email envoyé !
                </h2>
                <p className="text-slate-500 mb-6">
                  Si un compte existe avec l'adresse <strong className="text-slate-700">{getValues('email')}</strong>, 
                  vous recevrez un lien de réinitialisation.
                </p>

                {/* Dev Token Display */}
                {devToken && (
                  <div className="mb-6 p-4 bg-slate-100 rounded-xl text-left">
                    <p className="text-xs text-slate-500 mb-1">🔧 Token de développement :</p>
                    <p className="text-xs font-mono text-slate-700 break-all">{devToken}</p>
                    <Link
                      to={`/reinitialiser-mot-de-passe?token=${devToken}`}
                      className="inline-block mt-2 text-xs text-[#206080] hover:underline"
                    >
                      Utiliser ce token →
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || isLoading}
                  className="text-[#206080] hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                >
                  {cooldown > 0 ? (
                    <span className="text-slate-500">
                      Renvoyer dans {cooldown}s
                    </span>
                  ) : (
                    'Renvoyer l\'email'
                  )}
                </button>
              </div>
            </>
          )}

          {/* Back to login */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <Link
              to="/connexion"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#206080] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
