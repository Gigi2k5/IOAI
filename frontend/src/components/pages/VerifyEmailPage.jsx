import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, RefreshCw, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../store/AuthContext'
import api from '../../services/api'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const { user, checkAuth } = useAuth()
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState(null)
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const [devCode, setDevCode] = useState(null)
  
  const inputRefs = useRef([])

  // Rediriger si déjà vérifié ou pas connecté
  useEffect(() => {
    if (!user) {
      navigate('/connexion', { replace: true })
    } else if (user.is_verified) {
      navigate('/tableau-de-bord', { replace: true })
    }
  }, [user, navigate])

  // Focus sur le premier input au montage
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Cooldown timer
  const startCooldown = (seconds = 60) => {
    setCooldown(seconds)
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

  // Gérer la saisie d'un chiffre
  const handleChange = (index, value) => {
    // Ne garder que le dernier chiffre
    const digit = value.replace(/\D/g, '').slice(-1)
    
    const newCode = [...code]
    newCode[index] = digit
    setCode(newCode)
    setError(null)

    // Auto-focus sur le suivant
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Gérer le backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Gérer le paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('')
      setCode(newCode)
      setError(null)
      inputRefs.current[5]?.focus()
    }
  }

  // Vérifier le code
  const handleVerify = async () => {
    const fullCode = code.join('')
    
    if (fullCode.length !== 6) {
      setError('Veuillez entrer les 6 chiffres du code')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await api.post('/auth/verify-otp', { code: fullCode })
      
      if (response.data.success) {
        toast.success('Email vérifié avec succès !')
        await checkAuth() // Rafraîchir les données utilisateur
        navigate('/tableau-de-bord', { replace: true })
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Code invalide'
      setError(errorMessage)
      
      // Extraire le nombre de tentatives restantes si mentionné
      const match = errorMessage.match(/(\d+) tentative/)
      if (match) {
        setAttemptsLeft(parseInt(match[1]))
      } else {
        setAttemptsLeft((prev) => Math.max(0, prev - 1))
      }
      
      // Vider les inputs
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  // Renvoyer le code
  const handleResend = async () => {
    if (cooldown > 0) return

    try {
      setIsResending(true)
      setError(null)
      
      const response = await api.post('/auth/send-otp')
      
      if (response.data.success) {
        toast.success('Nouveau code envoyé')
        startCooldown()
        setAttemptsLeft(3)
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        
        // En dev, afficher le code
        if (response.data.dev_code) {
          setDevCode(response.data.dev_code)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'envoi')
    } finally {
      setIsResending(false)
    }
  }

  // Vérifier automatiquement quand les 6 chiffres sont entrés
  useEffect(() => {
    if (code.every((digit) => digit !== '') && code.join('').length === 6) {
      handleVerify()
    }
  }, [code])

  const isCodeComplete = code.every((digit) => digit !== '')

  if (!user) {
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#206080]/10 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-[#206080]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
              Vérifiez votre email
            </h1>
            <p className="text-slate-500">
              Un code à 6 chiffres a été envoyé à
            </p>
            <p className="font-medium text-slate-700 mt-1">
              {user?.email}
            </p>
          </div>

          {/* Dev Code Display */}
          {devCode && (
            <div className="mb-6 p-4 bg-slate-100 rounded-xl text-center">
              <p className="text-xs text-slate-500 mb-1">🔧 Code de développement :</p>
              <p className="text-2xl font-mono font-bold text-slate-700 tracking-widest">{devCode}</p>
            </div>
          )}

          {/* Code Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-2xl font-mono font-bold rounded-xl border-2 
                  focus:outline-none focus:ring-4 transition-all
                  ${error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                    : digit 
                      ? 'border-[#206080] bg-[#206080]/5 focus:ring-[#206080]/20'
                      : 'border-slate-300 focus:border-[#206080] focus:ring-[#206080]/20'
                  }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          {/* Attempts Left */}
          {attemptsLeft < 3 && attemptsLeft > 0 && (
            <p className="text-center text-sm text-amber-600 mb-4">
              Il vous reste {attemptsLeft} tentative{attemptsLeft > 1 ? 's' : ''}
            </p>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={!isCodeComplete || isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#206080] text-white font-semibold rounded-xl hover:bg-[#185068] focus:outline-none focus:ring-4 focus:ring-[#206080]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Vérifier
              </>
            )}
          </button>

          {/* Resend Button */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 mb-2">
              Vous n'avez pas reçu le code ?
            </p>
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="inline-flex items-center gap-2 text-[#206080] hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              {isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {cooldown > 0 ? (
                <span className="text-slate-500">
                  Renvoyer dans {cooldown}s
                </span>
              ) : (
                'Renvoyer le code'
              )}
            </button>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Vérifiez également vos spams si vous ne trouvez pas l'email.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
