import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Search, Filter, Upload, Download, Eye, X,
  CheckCircle, Clock, BarChart3, Settings, Copy, Play, Save, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../services/api'

const categories = ['Toutes', 'Logique', 'Algorithmique', 'Mathématiques', 'IA']
const difficulties = ['Toutes', 'easy', 'medium', 'hard']
const difficultyLabels = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' }
const difficultyColors = { easy: 'bg-green-400/10 text-green-400', medium: 'bg-orange-400/10 text-orange-400', hard: 'bg-red-400/10 text-red-400' }

// Modal création/édition question
function QuestionModal({ question, onClose, onSave }) {
  const [formData, setFormData] = useState(question || {
    text: '', category: 'Logique', difficulty: 'medium',
    options: ['', '', '', ''], correctIndex: 0
  })

  const handleSave = () => {
    if (!formData.text.trim()) return toast.error('Saisissez l\'énoncé')
    if (formData.options.some(o => !o.trim())) return toast.error('Remplissez toutes les options')
    onSave(formData)
    onClose()
  }

  const updateOption = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            {question ? 'Modifier la question' : 'Nouvelle question'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          <div>
            <label className="label">Énoncé de la question *</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="input resize-none"
              rows={3}
              placeholder="Saisissez l'énoncé de la question..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Catégorie</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input">
                {categories.filter(c => c !== 'Toutes').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulté</label>
              <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="input">
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Options de réponse *</label>
            <div className="space-y-3">
              {formData.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, correctIndex: i })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                      ${formData.correctIndex === i ? 'bg-green-500 text-slate-900' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                  >
                    {formData.correctIndex === i ? <CheckCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="input flex-1"
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">Cliquez sur une lettre pour définir la bonne réponse</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-100">
          <button onClick={onClose} className="btn-ghost">Annuler</button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Enregistrer
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Modal prévisualisation QCM
function PreviewModal({ questions, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const current = questions[currentIndex]

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">Prévisualisation QCM</h2>
            <p className="text-sm text-slate-400">Question {currentIndex + 1} / {questions.length}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 rounded text-xs bg-slate-200 text-slate-500">{current.category}</span>
            <span className={`px-2 py-1 rounded text-xs ${difficultyColors[current.difficulty]}`}>{difficultyLabels[current.difficulty]}</span>
          </div>

          <p className="text-lg text-slate-900 mb-6">{current.text}</p>

          <div className="space-y-3">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => !showResult && handleAnswer(i)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4
                  ${showResult && i === current.correctIndex ? 'bg-green-500/20 border-2 border-green-500' :
                    showResult && i === selectedAnswer && i !== current.correctIndex ? 'bg-red-500/20 border-2 border-red-500' :
                    selectedAnswer === i ? 'bg-primary-100 border-2 border-primary-500' :
                    'bg-slate-50 border-2 border-transparent hover:border-slate-200'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold
                  ${showResult && i === current.correctIndex ? 'bg-green-500 text-slate-900' :
                    showResult && i === selectedAnswer && i !== current.correctIndex ? 'bg-red-500 text-slate-900' :
                    'bg-slate-200 text-slate-500'}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-slate-900">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <button onClick={onClose} className="btn-ghost">Fermer</button>
          {showResult && currentIndex < questions.length - 1 && (
            <button onClick={handleNext} className="btn-primary">Question suivante</button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Modal paramètres QCM
function SettingsModal({ onClose, settings, onSave }) {
  const [duration, setDuration] = useState(settings?.duration_minutes || 30)
  const [questionsCount, setQuestionsCount] = useState(settings?.total_questions || 20)
  const [randomize, setRandomize] = useState(settings?.randomize_questions ?? true)
  const [easyCount, setEasyCount] = useState(settings?.easy_count || 5)
  const [mediumCount, setMediumCount] = useState(settings?.medium_count || 10)
  const [hardCount, setHardCount] = useState(settings?.hard_count || 5)

  const handleSave = async () => {
    try {
      const response = await api.put('/qcm/admin/settings', {
        duration_minutes: parseInt(duration),
        total_questions: parseInt(questionsCount),
        randomize_questions: randomize,
        easy_count: parseInt(easyCount),
        medium_count: parseInt(mediumCount),
        hard_count: parseInt(hardCount)
      })
      if (response.data.success) {
        toast.success('Paramètres enregistrés')
        onSave(response.data.data)
        onClose()
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="font-display text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-600" /> Paramètres du QCM
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="label">Durée du test (minutes)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="input" min={5} max={120} />
          </div>
          <div>
            <label className="label">Nombre de questions</label>
            <input type="number" value={questionsCount} onChange={(e) => setQuestionsCount(e.target.value)} className="input" min={5} max={50} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="label text-xs">Facile</label>
              <input type="number" value={easyCount} onChange={(e) => setEasyCount(e.target.value)} className="input" min={0} />
            </div>
            <div>
              <label className="label text-xs">Moyen</label>
              <input type="number" value={mediumCount} onChange={(e) => setMediumCount(e.target.value)} className="input" min={0} />
            </div>
            <div>
              <label className="label text-xs">Difficile</label>
              <input type="number" value={hardCount} onChange={(e) => setHardCount(e.target.value)} className="input" min={0} />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
            <div>
              <div className="text-sm text-slate-900">Ordre aléatoire</div>
              <div className="text-xs text-slate-400">Mélanger les questions et options</div>
            </div>
            <button
              onClick={() => setRandomize(!randomize)}
              className={`w-12 h-6 rounded-full transition-colors ${randomize ? 'bg-primary-500' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${randomize ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <button onClick={onClose} className="btn-ghost">Annuler</button>
          <button onClick={handleSave} className="btn-primary">Enregistrer</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function QuestionsManager() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Toutes')
  const [difficultyFilter, setDifficultyFilter] = useState('Toutes')
  const [showModal, setShowModal] = useState(false)
  const [editQuestion, setEditQuestion] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [qcmSettings, setQcmSettings] = useState(null)

  // Charger les questions depuis l'API
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const [questionsRes, settingsRes] = await Promise.all([
          api.get('/qcm/admin/questions?per_page=100'),
          api.get('/qcm/admin/settings')
        ])
        
        if (questionsRes.data.success) {
          const transformedQuestions = questionsRes.data.data.questions.map(q => ({
            id: q.id,
            text: q.text,
            category: q.category,
            difficulty: q.difficulty,
            options: q.options,
            correctIndex: q.correct_answer,
            stats: {
              attempts: q.times_shown || 0,
              correct: q.times_correct || 0,
              avgTime: 0
            }
          }))
          setQuestions(transformedQuestions)
        }
        
        if (settingsRes.data.success) {
          setQcmSettings(settingsRes.data.data)
        }
      } catch (error) {
        console.error('Erreur chargement questions:', error)
        toast.error('Erreur lors du chargement des questions')
      } finally {
        setLoading(false)
      }
    }
    
    loadQuestions()
  }, [])

  const filtered = questions.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'Toutes' || q.category === categoryFilter
    const matchDifficulty = difficultyFilter === 'Toutes' || q.difficulty === difficultyFilter
    return matchSearch && matchCategory && matchDifficulty
  })

  const handleSave = async (data) => {
    try {
      if (data.id) {
        // Modifier une question existante
        const response = await api.put(`/qcm/admin/questions/${data.id}`, {
          text: data.text,
          option_a: data.options[0],
          option_b: data.options[1],
          option_c: data.options[2],
          option_d: data.options[3],
          correct_answer: data.correctIndex,
          category: data.category,
          difficulty: data.difficulty
        })
        if (response.data.success) {
          setQuestions(questions.map(q => q.id === data.id ? { ...data, stats: q.stats } : q))
          toast.success('Question modifiée')
        }
      } else {
        // Créer une nouvelle question
        const response = await api.post('/qcm/admin/questions', {
          text: data.text,
          option_a: data.options[0],
          option_b: data.options[1],
          option_c: data.options[2],
          option_d: data.options[3],
          correct_answer: data.correctIndex,
          category: data.category,
          difficulty: data.difficulty
        })
        if (response.data.success) {
          const newQ = response.data.data
          setQuestions([...questions, { 
            id: newQ.id, 
            text: newQ.text,
            category: newQ.category,
            difficulty: newQ.difficulty,
            options: newQ.options,
            correctIndex: newQ.correct_answer,
            stats: { attempts: 0, correct: 0, avgTime: 0 } 
          }])
          toast.success('Question ajoutée')
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Supprimer cette question ?')) {
      try {
        const response = await api.delete(`/qcm/admin/questions/${id}`)
        if (response.data.success) {
          setQuestions(questions.filter(q => q.id !== id))
          toast.success('Question supprimée')
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  // Export des questions en JSON
  const handleExport = () => {
    try {
      const exportData = {
        exported_at: new Date().toISOString(),
        total_questions: questions.length,
        questions: questions.map(q => ({
          text: q.text,
          category: q.category,
          difficulty: q.difficulty,
          options: q.options,
          correct_answer: q.correctIndex
        }))
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `questions_qcm_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success(`${questions.length} questions exportées`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Erreur lors de l\'export')
    }
  }

  // Import des questions depuis un fichier JSON
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        
        if (!data.questions || !Array.isArray(data.questions)) {
          toast.error('Format de fichier invalide')
          return
        }
        
        let imported = 0
        let errors = 0
        
        for (const q of data.questions) {
          try {
            // Valider la question
            if (!q.text || !q.options || q.options.length !== 4) {
              errors++
              continue
            }
            
            const response = await api.post('/qcm/admin/questions', {
              text: q.text,
              option_a: q.options[0],
              option_b: q.options[1],
              option_c: q.options[2],
              option_d: q.options[3],
              correct_answer: q.correct_answer || 0,
              category: q.category || 'Logique',
              difficulty: q.difficulty || 'medium'
            })
            
            if (response.data.success) {
              const newQ = response.data.data
              setQuestions(prev => [...prev, {
                id: newQ.id,
                text: newQ.text,
                category: newQ.category,
                difficulty: newQ.difficulty,
                options: [newQ.option_a, newQ.option_b, newQ.option_c, newQ.option_d],
                correctIndex: newQ.correct_answer,
                stats: { attempts: 0, correct: 0, avgTime: 0 }
              }])
              imported++
            } else {
              errors++
            }
          } catch (err) {
            errors++
          }
        }
        
        if (imported > 0) {
          toast.success(`${imported} question(s) importée(s)`)
        }
        if (errors > 0) {
          toast.error(`${errors} question(s) non importée(s)`)
        }
      } catch (error) {
        console.error('Import error:', error)
        toast.error('Erreur lors de l\'import du fichier')
      }
    }
    
    input.click()
  }

  const totalAttempts = questions.reduce((sum, q) => sum + q.stats.attempts, 0)
  const avgSuccess = questions.length > 0 ? Math.round(questions.reduce((sum, q) => sum + (q.stats.correct / Math.max(q.stats.attempts, 1)) * 100, 0) / questions.length) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Banque de questions</h1>
          <p className="text-slate-500">{questions.length} questions • {avgSuccess}% taux de réussite moyen</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowSettings(true)} className="btn-ghost text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" /> Paramètres
          </button>
          <button onClick={() => setShowPreview(true)} className="btn-secondary text-sm flex items-center gap-2">
            <Play className="w-4 h-4" /> Prévisualiser
          </button>
          <button onClick={() => { setEditQuestion(null); setShowModal(true) }} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouvelle question
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total questions', value: questions.length, icon: BarChart3, color: 'gold' },
          { label: 'Tentatives', value: totalAttempts, icon: Clock, color: 'blue' },
          { label: 'Taux réussite', value: `${avgSuccess}%`, icon: CheckCircle, color: 'green' },
          { label: 'Catégories', value: [...new Set(questions.map(q => q.category))].length, icon: Filter, color: 'purple' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center
              ${stat.color === 'gold' ? 'bg-primary-50 text-primary-600' :
                stat.color === 'blue' ? 'bg-blue-400/10 text-blue-400' :
                stat.color === 'green' ? 'bg-green-400/10 text-green-400' :
                'bg-purple-400/10 text-purple-400'}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-display font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filtres et actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une question..." className="input pl-12 w-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input w-auto">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="input w-auto">
            {difficulties.map(d => <option key={d} value={d}>{d === 'Toutes' ? 'Toutes difficultés' : difficultyLabels[d]}</option>)}
          </select>
          <button onClick={handleImport} className="btn-ghost text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" /> Importer
          </button>
          <button onClick={handleExport} className="btn-ghost text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Exporter
          </button>
        </div>
      </motion.div>

      {/* Liste des questions */}
      <div className="space-y-4">
        {filtered.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
            className="card p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex-1">
                <p className="text-slate-900 mb-3">{q.text}</p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded text-xs bg-slate-200 text-slate-500">{q.category}</span>
                  <span className={`px-2 py-1 rounded text-xs ${difficultyColors[q.difficulty]}`}>{difficultyLabels[q.difficulty]}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={`p-2 rounded-lg ${oi === q.correctIndex ? 'bg-green-500/10 text-green-400' : 'bg-slate-50 text-slate-500'}`}>
                      {String.fromCharCode(65 + oi)}. {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-2">
                <div className="text-right hidden lg:block">
                  <div className="text-sm text-slate-400">{q.stats.attempts} tentatives</div>
                  <div className={`text-lg font-bold ${q.stats.attempts > 0 && (q.stats.correct / q.stats.attempts * 100) >= 60 ? 'text-green-400' : 'text-orange-400'}`}>
                    {q.stats.attempts > 0 ? Math.round(q.stats.correct / q.stats.attempts * 100) : 0}%
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditQuestion(q); setShowModal(true) }} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-900" title="Modifier">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(q.text).then(() => toast.success('Copié'))} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-900" title="Copier">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-900/20 mx-auto mb-4" />
            <p className="text-slate-400">Aucune question ne correspond à vos critères</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && <QuestionModal question={editQuestion} onClose={() => { setShowModal(false); setEditQuestion(null) }} onSave={handleSave} />}
        {showPreview && <PreviewModal questions={filtered.length > 0 ? filtered : questions} onClose={() => setShowPreview(false)} />}
        {showSettings && <SettingsModal settings={qcmSettings} onClose={() => setShowSettings(false)} onSave={setQcmSettings} />}
      </AnimatePresence>
    </div>
  )
}