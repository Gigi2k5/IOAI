import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../store/AuthContext'
import { Clock, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft, Send, Brain, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../services/api'

const TOTAL_TIME = 30 * 60 // 30 minutes en secondes (fallback)

export default function QCMPage() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('loading') // loading, intro, quiz, result
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [score, setScore] = useState(null)
  const [questions, setQuestions] = useState([])
  const [attemptId, setAttemptId] = useState(null)
  const [qcmSettings, setQcmSettings] = useState(null)
  const [qcmStatus, setQcmStatus] = useState(null)

  // Charger le statut du QCM au démarrage
  useEffect(() => {
    const loadQCMStatus = async () => {
      try {
        const [statusRes, settingsRes] = await Promise.all([
          api.get('/qcm/status'),
          api.get('/qcm/settings')
        ])
        
        if (statusRes.data.success) {
          setQcmStatus(statusRes.data.data)
          
          // Si QCM déjà complété, aller directement aux résultats
          if (statusRes.data.data.status === 'completed') {
            setScore(statusRes.data.data.score)
            setStep('result')
            return
          }
          
          // Si QCM en cours, reprendre
          if (statusRes.data.data.status === 'in_progress') {
            await resumeQCM(statusRes.data.data.attempt_id)
            return
          }
        }
        
        if (settingsRes.data.success) {
          setQcmSettings(settingsRes.data.data)
        }
        
        setStep('intro')
      } catch (error) {
        console.error('Erreur chargement QCM:', error)
        toast.error('Erreur lors du chargement du QCM')
        setStep('intro')
      }
    }
    
    loadQCMStatus()
  }, [])

  // Reprendre un QCM en cours
  const resumeQCM = async (existingAttemptId) => {
    try {
      const response = await api.post('/qcm/start')
      if (response.data.success) {
        const data = response.data.data
        setAttemptId(data.attempt_id)
        setQuestions(data.questions)
        setTimeLeft(data.time_remaining_seconds)
        
        // Restaurer les réponses
        const savedAnswers = {}
        data.answers.forEach((ans, idx) => {
          if (ans !== -1) {
            savedAnswers[data.questions[idx].id] = ['A', 'B', 'C', 'D'][ans]
          }
        })
        setAnswers(savedAnswers)
        
        setStep('quiz')
      }
    } catch (error) {
      console.error('Erreur reprise QCM:', error)
      toast.error('Erreur lors de la reprise du QCM')
    }
  }

  // Timer
  useEffect(() => {
    if (step !== 'quiz') return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [step])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleAnswer = async (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    // Sauvegarder la réponse en temps réel
    if (attemptId) {
      try {
        const answerIndex = ['A', 'B', 'C', 'D'].indexOf(answer)
        await api.post('/qcm/answer', {
          attempt_id: attemptId,
          question_index: currentQuestion,
          answer_index: answerIndex
        })
      } catch (error) {
        console.error('Erreur sauvegarde réponse:', error)
      }
    }
  }

  const startQCM = async () => {
    try {
      const response = await api.post('/qcm/start')
      if (response.data.success) {
        const data = response.data.data
        setAttemptId(data.attempt_id)
        setQuestions(data.questions)
        setTimeLeft(data.time_remaining_seconds)
        setStep('quiz')
      } else {
        toast.error(response.data.error || 'Impossible de démarrer le QCM')
      }
    } catch (error) {
      console.error('Erreur démarrage QCM:', error)
      toast.error(error.response?.data?.error || 'Erreur lors du démarrage du QCM')
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!attemptId) {
      // Mode fallback avec questions mock si pas d'attemptId
      const mockQuestions = questions.length > 0 ? questions : []
      let correct = 0
      mockQuestions.forEach(q => {
        const answerIndex = ['A', 'B', 'C', 'D'].indexOf(answers[q.id])
        if (answerIndex === q.correct_answer) correct++
      })
      const finalScore = mockQuestions.length > 0 ? (correct / mockQuestions.length) * 100 : 0
      setScore(finalScore)
      setStep('result')
      toast.success('QCM soumis avec succès !')
      return
    }
    
    try {
      const response = await api.post('/qcm/submit', { attempt_id: attemptId })
      
      if (response.data.success) {
        const result = response.data.data
        setScore(result.score)
        
        updateUser({
          candidate: {
            ...user.candidate,
            qcm_score: result.score,
            qcm_passed: true
          }
        })
        
        setStep('result')
        toast.success('QCM soumis avec succès !')
      } else {
        toast.error(response.data.error || 'Erreur lors de la soumission')
      }
    } catch (error) {
      console.error('Erreur soumission QCM:', error)
      toast.error(error.response?.data?.error || 'Erreur lors de la soumission du QCM')
    }
  }, [answers, user, updateUser, attemptId, questions])

  const question = questions[currentQuestion]

  // Loading state
  if (step === 'loading') {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-slate-500">Chargement du QCM...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {/* INTRO */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 
                          flex items-center justify-center shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="font-display text-2xl font-bold text-slate-900 mb-4">
              QCM de Sélection
            </h1>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Ce test évalue vos capacités de raisonnement logique. 
              Vous avez {qcmSettings?.duration_minutes || 30} minutes pour répondre à {qcmSettings?.total_questions || 20} questions.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Target, label: `${qcmSettings?.total_questions || 20} questions`, value: 'Logique & Math' },
                { icon: Clock, label: `${qcmSettings?.duration_minutes || 30} minutes`, value: 'Temps limité' },
                { icon: AlertTriangle, label: 'Une seule', value: 'Tentative' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-slate-50">
                  <item.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="font-semibold text-slate-900">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.value}</div>
                </div>
              ))}
            </div>

            {qcmStatus && !qcmStatus.can_start && qcmStatus.message && (
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-8 text-left">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-orange-400 font-medium">Information</p>
                    <p className="text-sm text-slate-500">{qcmStatus.message}</p>
                  </div>
                </div>
              </div>
            )}

            {(!qcmStatus || qcmStatus.can_start) && (
              <>
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-8 text-left">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-orange-400 font-medium">Attention</p>
                      <p className="text-sm text-slate-500">
                        Une fois commencé, vous ne pourrez pas quitter le test. 
                        Assurez-vous d'avoir une connexion stable.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={startQCM}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Commencer le test
                </motion.button>
              </>
            )}
          </motion.div>
        )}

        {/* QUIZ */}
        {step === 'quiz' && question && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Timer & Progress */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-slate-500">Question {currentQuestion + 1}/{questions.length}</span>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full 
                ${timeLeft < 300 ? 'bg-red-500/10 text-red-400' : 'bg-primary-50 text-primary-600'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Question */}
            <div className="card p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-8">{question.text}</h2>

              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const key = ['A', 'B', 'C', 'D'][idx]
                  return (
                    <motion.button
                      key={key}
                      onClick={() => handleAnswer(question.id, key)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4
                        ${answers[question.id] === key 
                          ? 'bg-primary-100 border-2 border-primary-500' 
                          : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold
                        ${answers[question.id] === key ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {key}
                      </div>
                      <span className="text-slate-900">{option}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="btn-ghost flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Soumettre
                  </motion.button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Question dots */}
            <div className="flex justify-center gap-2 mt-6">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-3 h-3 rounded-full transition-all
                    ${i === currentQuestion ? 'bg-primary-500 scale-125' : 
                      answers[questions[i].id] ? 'bg-green-500' : 'bg-slate-100'}`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
                ${score >= 60 ? 'bg-green-500/20' : 'bg-orange-500/20'}`}
            >
              <CheckCircle className={`w-12 h-12 ${score >= 60 ? 'text-green-500' : 'text-orange-500'}`} />
            </motion.div>

            <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
              Test terminé !
            </h1>
            <p className="text-slate-500 mb-8">Voici votre résultat</p>

            <div className="text-6xl font-display font-bold text-gradient mb-2">
              {score?.toFixed(0)}%
            </div>
            <p className="text-slate-400 mb-8">
              {score >= 60 ? 'Excellent travail !' : 'Continuez à vous entraîner !'}
            </p>

            <motion.button
              onClick={() => navigate('/resultats')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Voir mes résultats détaillés
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
