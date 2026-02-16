import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Download, CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight,
  Filter, MoreVertical, Mail, Phone, MapPin, School, Calendar, FileText,
  X, MessageSquare, History, UserCheck, AlertTriangle, Check, Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../services/api'

const regions = ['Toutes', 'Atlantique', 'Littoral', 'Ouémé', 'Borgou', 'Alibori', 'Atacora', 'Collines', 'Couffo', 'Donga', 'Mono', 'Plateau', 'Zou']
const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'submitted', label: 'En attente' },
  { value: 'validated', label: 'Validés' },
  { value: 'rejected', label: 'Rejetés' }
]

// Modal détail candidat
function CandidateDetailModal({ candidate, onClose, onValidate, onReject }) {
  const [comment, setComment] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  if (!candidate) return null

  const handleValidate = () => {
    onValidate(candidate.id, comment)
    onClose()
  }

  const handleReject = () => {
    if (!comment.trim()) {
      toast.error('Veuillez indiquer un motif de rejet')
      return
    }
    onReject(candidate.id, comment)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="font-display text-xl font-semibold text-slate-900">Détail du candidat</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Profil */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 text-2xl font-bold">
              {candidate.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-900">{candidate.name}</h3>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium mt-2
                ${candidate.status === 'validated' ? 'bg-green-400/10 text-green-400' :
                  candidate.status === 'submitted' ? 'bg-orange-400/10 text-orange-400' :
                  'bg-red-400/10 text-red-400'}`}>
                {candidate.status === 'validated' ? 'Validé' : candidate.status === 'submitted' ? 'En attente' : 'Rejeté'}
              </span>
            </div>
            {candidate.score && (
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-primary-600">{candidate.score}%</div>
                <div className="text-xs text-slate-400">Score QCM</div>
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <Mail className="w-5 h-5 text-primary-600" />
              <div><div className="text-xs text-slate-400">Email</div><div className="text-sm text-slate-900">{candidate.email}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <Phone className="w-5 h-5 text-primary-600" />
              <div><div className="text-xs text-slate-400">Téléphone</div><div className="text-sm text-slate-900">{candidate.phone}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <School className="w-5 h-5 text-primary-600" />
              <div><div className="text-xs text-slate-400">Établissement</div><div className="text-sm text-slate-900">{candidate.school}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <MapPin className="w-5 h-5 text-primary-600" />
              <div><div className="text-xs text-slate-400">Localisation</div><div className="text-sm text-slate-900">{candidate.city}, {candidate.region}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div><div className="text-xs text-slate-400">Date de naissance</div><div className="text-sm text-slate-900">{new Date(candidate.birthDate).toLocaleDateString('fr-FR')}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <FileText className="w-5 h-5 text-primary-600" />
              <div><div className="text-xs text-slate-400">Inscrit le</div><div className="text-sm text-slate-900">{new Date(candidate.registeredAt).toLocaleDateString('fr-FR')}</div></div>
            </div>
          </div>

          {/* Historique */}
          {(candidate.validatedBy || candidate.rejectedBy) && (
            <div className="mb-6 p-4 rounded-lg bg-slate-100 border border-slate-100">
              <h4 className="text-sm font-medium text-slate-900/70 mb-3 flex items-center gap-2"><History className="w-4 h-4" /> Historique</h4>
              {candidate.validatedBy && (
                <p className="text-sm text-green-400">✓ Validé par {candidate.validatedBy} le {new Date(candidate.validatedAt).toLocaleDateString('fr-FR')}</p>
              )}
              {candidate.rejectedBy && (
                <div className="text-sm text-red-400">
                  <p>✗ Rejeté par {candidate.rejectedBy} le {new Date(candidate.rejectedAt).toLocaleDateString('fr-FR')}</p>
                  <p className="text-slate-400 mt-1">Motif : {candidate.rejectReason}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions de validation */}
          {candidate.status === 'submitted' && (
            <div className="space-y-4">
              <div>
                <label className="label">Commentaire (optionnel pour validation, obligatoire pour rejet)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input resize-none"
                  rows={3}
                  placeholder="Ajouter un commentaire..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-100">
          <button onClick={onClose} className="btn-ghost">Fermer</button>
          {candidate.status === 'submitted' && (
            <div className="flex gap-3">
              <button onClick={handleReject} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Rejeter
              </button>
              <button onClick={handleValidate} className="btn-primary flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Valider
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function CandidatesList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('Toutes')
  const [scoreFilter, setScoreFilter] = useState('all')
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 })

  // Charger les candidats depuis l'API
  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append('page', pagination.page)
        params.append('per_page', 20)
        if (statusFilter !== 'all') params.append('status', statusFilter)
        if (regionFilter !== 'Toutes') params.append('region', regionFilter)
        if (search) params.append('search', search)
        
        const response = await api.get(`/candidate/admin/list?${params.toString()}`)
        
        if (response.data.success) {
          const data = response.data.data
          // Transformer les données pour le format attendu
          const transformedCandidates = data.candidates.map(c => ({
            id: c.id,
            name: c.full_name || `${c.first_name} ${c.last_name}`,
            email: c.email || '',
            phone: c.phone || '',
            school: c.school_name || '',
            region: c.region || '',
            city: c.city || '',
            status: c.status,
            score: c.qcm_score,
            gender: c.gender,
            birthDate: c.birth_date,
            registeredAt: c.created_at,
            validatedAt: c.validated_at,
            rejectedAt: c.rejected_at,
            rejectReason: c.rejection_reason
          }))
          setCandidates(transformedCandidates)
          setPagination(prev => ({
            ...prev,
            total: data.total,
            pages: data.pages
          }))
        }
      } catch (error) {
        console.error('Erreur chargement candidats:', error)
        toast.error('Erreur lors du chargement des candidats')
      } finally {
        setLoading(false)
      }
    }
    
    loadCandidates()
  }, [statusFilter, regionFilter, search, pagination.page])

  const filtered = candidates.filter(c => {
    const matchScore = scoreFilter === 'all' || 
      (scoreFilter === 'high' && c.score >= 80) ||
      (scoreFilter === 'medium' && c.score >= 50 && c.score < 80) ||
      (scoreFilter === 'low' && c.score < 50) ||
      (scoreFilter === 'none' && c.score === null)
    return matchScore
  })

  const handleValidate = async (id, comment) => {
    try {
      const response = await api.post(`/candidate/admin/${id}/validate`, { comment })
      if (response.data.success) {
        toast.success(`Candidature validée`)
        // Mettre à jour localement
        setCandidates(prev => prev.map(c => 
          c.id === id ? { ...c, status: 'validated' } : c
        ))
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la validation')
    }
  }

  const handleReject = async (id, comment) => {
    try {
      const response = await api.post(`/candidate/admin/${id}/reject`, { reason: comment })
      if (response.data.success) {
        toast.error(`Candidature rejetée`)
        setCandidates(prev => prev.map(c => 
          c.id === id ? { ...c, status: 'rejected', rejectReason: comment } : c
        ))
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors du rejet')
    }
  }

  const handleBulkValidate = async () => {
    if (selectedIds.length === 0) return toast.error('Sélectionnez des candidats')
    try {
      const response = await api.post('/candidate/admin/bulk-validate', { candidate_ids: selectedIds })
      if (response.data.success) {
        toast.success(`${response.data.data.total_validated} candidature(s) validée(s)`)
        setCandidates(prev => prev.map(c => 
          selectedIds.includes(c.id) ? { ...c, status: 'validated' } : c
        ))
        setSelectedIds([])
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la validation groupée')
    }
  }

  const handleExport = async (format) => {
    toast.success(`Export ${format.toUpperCase()} en cours...`)
    try {
      // Utiliser les candidats filtrés actuels
      const dataToExport = filtered.length > 0 ? filtered : candidates
      
      if (format === 'csv') {
        // Créer le CSV
        const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Établissement', 'Classe', 'Ville', 'Région', 'Statut', 'Score QCM', 'Date inscription']
        const rows = dataToExport.map(c => [
          c.id,
          c.name,
          c.email,
          c.phone || '',
          c.school || '',
          c.classLevel || '',
          c.city || '',
          c.region || '',
          c.status,
          c.score || '',
          c.registrationDate ? new Date(c.registrationDate).toLocaleDateString('fr-FR') : ''
        ])
        
        const csvContent = [
          headers.join(';'),
          ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
        ].join('\n')
        
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `candidats_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success(`${dataToExport.length} candidat(s) exporté(s)`)
      } else {
        // Export JSON
        const exportData = {
          exported_at: new Date().toISOString(),
          total_candidates: dataToExport.length,
          filters_applied: {
            status: statusFilter,
            region: regionFilter,
            search: search
          },
          candidates: dataToExport
        }
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `candidats_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success(`${dataToExport.length} candidat(s) exporté(s)`)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Erreur lors de l\'export')
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map(c => c.id))
    }
  }

  const getStatusLabel = (s) => ({ validated: 'Validé', submitted: 'En attente', rejected: 'Rejeté', draft: 'Brouillon' }[s] || s)
  const getStatusStyle = (s) => ({
    validated: 'bg-green-400/10 text-green-400',
    submitted: 'bg-orange-400/10 text-orange-400',
    rejected: 'bg-red-400/10 text-red-400',
    draft: 'bg-gray-400/10 text-gray-400'
  }[s] || 'bg-gray-400/10 text-gray-400')

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Gestion des candidats</h1>
          <p className="text-slate-500">{pagination.total} candidat(s) • {candidates.filter(c => c.status === 'submitted').length} en attente</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <button className="btn-secondary text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button onClick={() => handleExport('csv')} className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-t-xl">
                Export CSV
              </button>
              <button onClick={() => handleExport('json')} className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-b-xl">
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtres */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email, établissement..." className="input pl-12 w-full" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-primary-50' : ''}`}>
            <Filter className="w-4 h-4" /> Filtres {showFilters && <span className="text-xs">▲</span>}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden">
              <div>
                <label className="label">Statut</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
                  {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Département</label>
                <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="input">
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Score QCM</label>
                <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} className="input">
                  <option value="all">Tous</option>
                  <option value="high">≥ 80%</option>
                  <option value="medium">50-79%</option>
                  <option value="low">&lt; 50%</option>
                  <option value="none">Non passé</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setStatusFilter('all'); setRegionFilter('Toutes'); setScoreFilter('all') }}
                  className="btn-ghost w-full">Réinitialiser</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Actions groupées */}
      {selectedIds.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
          <span className="text-sm text-primary-600 font-medium">{selectedIds.length} sélectionné(s)</span>
          <div className="flex-1" />
          <button onClick={handleBulkValidate} className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Valider
          </button>
          <button onClick={() => handleExport('csv')} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
            <Download className="w-4 h-4" /> Exporter
          </button>
          <button onClick={() => setSelectedIds([])} className="text-sm text-slate-500 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-slate-500">Chargement des candidats...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="card p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-slate-900/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun candidat trouvé</h3>
          <p className="text-slate-400">Modifiez vos filtres ou attendez de nouvelles inscriptions.</p>
        </div>
      )}

      {/* Table Desktop */}
      {!loading && filtered.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-4 text-left">
                  <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll} className="rounded border-slate-300" />
                </th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Candidat</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Contact</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Établissement</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Région</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Statut</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Score</th>
                <th className="text-right p-4 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className={`border-b border-slate-100 hover:bg-slate-50 ${selectedIds.includes(c.id) ? 'bg-primary-50/50' : ''}`}>
                  <td className="p-4">
                    <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded border-slate-300" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 font-semibold">{c.name.charAt(0)}</div>
                      <div>
                        <div className="font-medium text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.gender === 'M' ? '♂' : '♀'} • Inscrit le {new Date(c.registeredAt).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-900/70">{c.email}</div>
                    <div className="text-xs text-slate-400">{c.phone}</div>
                  </td>
                  <td className="p-4 text-slate-900/70 text-sm">{c.school}</td>
                  <td className="p-4 text-slate-900/70 text-sm">{c.region}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusStyle(c.status)}`}>{getStatusLabel(c.status)}</span>
                  </td>
                  <td className="p-4">
                    {c.score !== null ? <span className={`font-semibold ${c.score >= 70 ? 'text-green-400' : c.score >= 50 ? 'text-orange-400' : 'text-red-400'}`}>{c.score}%</span> : <span className="text-slate-900/30">-</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedCandidate(c)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-900" title="Voir détails">
                        <Eye className="w-4 h-4" />
                      </button>
                      {c.status === 'submitted' && (
                        <>
                          <button onClick={() => handleValidate(c.id)} className="p-2 rounded-lg hover:bg-green-500/10 text-green-400" title="Valider">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => setSelectedCandidate(c)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400" title="Rejeter (ouvrir détails)">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-slate-100">
          <span className="text-sm text-slate-400">{pagination.total} résultat(s)</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg bg-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded bg-primary-50 text-primary-600 text-sm">{pagination.page} / {pagination.pages || 1}</span>
            <button 
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
              disabled={pagination.page >= pagination.pages}
              className="p-2 rounded-lg bg-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
      )}

      {/* Mobile Cards */}
      {!loading && filtered.length > 0 && (
      <div className="lg:hidden space-y-4">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className={`card p-4 ${selectedIds.includes(c.id) ? 'border-primary-200' : ''}`}>
            <div className="flex items-start gap-3 mb-3">
              <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} className="mt-1 rounded border-slate-300" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.email}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(c.status)}`}>{getStatusLabel(c.status)}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="text-slate-400">{c.school || 'Non renseigné'}</div>
              <div className="text-slate-400 text-right">{c.region || 'Non renseigné'}</div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span>{c.score !== null ? <span className={`font-semibold ${c.score >= 70 ? 'text-green-400' : 'text-orange-400'}`}>{c.score}%</span> : <span className="text-slate-900/30">Pas de score</span>}</span>
              <div className="flex gap-2">
                <button onClick={() => setSelectedCandidate(c)} className="p-2 rounded-lg bg-white/5 text-slate-400"><Eye className="w-4 h-4" /></button>
                {c.status === 'submitted' && (
                  <>
                    <button onClick={() => handleValidate(c.id)} className="p-2 rounded-lg bg-green-500/10 text-green-400"><CheckCircle className="w-4 h-4" /></button>
                    <button onClick={() => handleReject(c.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400"><XCircle className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateDetailModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onValidate={handleValidate}
            onReject={handleReject}
          />
        )}
      </AnimatePresence>
    </div>
  )
}