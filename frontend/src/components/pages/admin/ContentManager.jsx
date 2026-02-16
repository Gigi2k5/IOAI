import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Calendar, HelpCircle, Users, Bell, Plus, Edit, Trash2, 
  X, Globe, ExternalLink, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../services/api'

const tabs = [
  { id: 'news', label: 'Actualités', icon: Bell },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'partners', label: 'Partenaires', icon: Users },
]

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState('news')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Données
  const [news, setNews] = useState([])
  const [faqs, setFaqs] = useState([])
  const [partners, setPartners] = useState([])
  const [timeline, setTimeline] = useState([])
  
  // Modal
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [formData, setFormData] = useState({})

  // Charger les données
  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'news') {
        const res = await api.get('/content/news')
        if (res.data.success) setNews(res.data.data.items || [])
      } else if (activeTab === 'faq') {
        const res = await api.get('/content/faq')
        if (res.data.success) setFaqs(res.data.data.items || [])
      } else if (activeTab === 'partners') {
        const res = await api.get('/content/partners')
        if (res.data.success) setPartners(res.data.data.items || [])
      } else if (activeTab === 'timeline') {
        const res = await api.get('/content/timeline')
        if (res.data.success) setTimeline(res.data.data.phases || [])
      }
    } catch (error) {
      console.error('Erreur chargement:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item = null) => {
    setEditItem(item)
    if (activeTab === 'news') {
      setFormData(item || { title: '', content: '', status: 'draft' })
    } else if (activeTab === 'faq') {
      setFormData(item || { question: '', answer: '', category: 'Inscription', order: faqs.length + 1 })
    } else if (activeTab === 'partners') {
      setFormData(item || { name: '', url: '', logo_url: '', type: 'partner' })
    } else if (activeTab === 'timeline') {
      setFormData(item || { phase_number: timeline.length + 1, title: '', description: '', start_date: '', end_date: '', status: 'upcoming' })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditItem(null)
    setFormData({})
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let endpoint = `/content/${activeTab}`
      let data = { ...formData }
      
      if (activeTab === 'news') {
        if (!data.title) { toast.error('Titre requis'); setSaving(false); return }
      } else if (activeTab === 'faq') {
        if (!data.question) { toast.error('Question requise'); setSaving(false); return }
      } else if (activeTab === 'partners') {
        if (!data.name) { toast.error('Nom requis'); setSaving(false); return }
      } else if (activeTab === 'timeline') {
        if (!data.title) { toast.error('Titre requis'); setSaving(false); return }
        endpoint = '/content/timeline'
      }

      let res
      if (editItem) {
        res = await api.put(`${endpoint}/${editItem.id}`, data)
      } else {
        res = await api.post(endpoint, data)
      }

      if (res.data.success) {
        toast.success(editItem ? 'Modifié avec succès' : 'Ajouté avec succès')
        closeModal()
        loadData()
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet élément ?')) return
    
    try {
      const endpoint = activeTab === 'timeline' ? '/content/timeline' : `/content/${activeTab}`
      const res = await api.delete(`${endpoint}/${id}`)
      if (res.data.success) {
        toast.success('Supprimé')
        loadData()
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const renderModal = () => {
    if (!showModal) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="font-display text-xl font-semibold text-slate-900">
              {editItem ? 'Modifier' : 'Ajouter'} {activeTab === 'news' ? 'une actualité' : activeTab === 'faq' ? 'une FAQ' : activeTab === 'partners' ? 'un partenaire' : 'une étape'}
            </h2>
            <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            {activeTab === 'news' && (
              <>
                <div><label className="label">Titre *</label><input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input" /></div>
                <div><label className="label">Contenu</label><textarea value={formData.content || ''} onChange={(e) => setFormData({...formData, content: e.target.value})} className="input resize-none" rows={4} /></div>
                <div>
                  <label className="label">Statut</label>
                  <select value={formData.status || 'draft'} onChange={(e) => setFormData({...formData, status: e.target.value})} className="input">
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                  </select>
                </div>
              </>
            )}
            {activeTab === 'faq' && (
              <>
                <div><label className="label">Question *</label><input type="text" value={formData.question || ''} onChange={(e) => setFormData({...formData, question: e.target.value})} className="input" /></div>
                <div><label className="label">Réponse *</label><textarea value={formData.answer || ''} onChange={(e) => setFormData({...formData, answer: e.target.value})} className="input resize-none" rows={4} /></div>
                <div><label className="label">Catégorie</label>
                  <select value={formData.category || 'Inscription'} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input">
                    <option>Inscription</option><option>Sélection</option><option>QCM</option><option>Autre</option>
                  </select>
                </div>
              </>
            )}
            {activeTab === 'partners' && (
              <>
                <div><label className="label">Nom *</label><input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input" /></div>
                <div><label className="label">URL du site</label><input type="url" value={formData.url || ''} onChange={(e) => setFormData({...formData, url: e.target.value})} className="input" placeholder="https://..." /></div>
                <div><label className="label">Type</label>
                  <select value={formData.type || 'partner'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="input">
                    <option value="institution">Institution</option>
                    <option value="partner">Partenaire</option>
                    <option value="sponsor">Sponsor</option>
                  </select>
                </div>
              </>
            )}
            {activeTab === 'timeline' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Phase N°</label><input type="number" value={formData.phase_number || ''} onChange={(e) => setFormData({...formData, phase_number: parseInt(e.target.value)})} className="input" /></div>
                  <div><label className="label">Statut</label>
                    <select value={formData.status || 'upcoming'} onChange={(e) => setFormData({...formData, status: e.target.value})} className="input">
                      <option value="upcoming">À venir</option>
                      <option value="active">En cours</option>
                      <option value="completed">Terminé</option>
                    </select>
                  </div>
                </div>
                <div><label className="label">Titre *</label><input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input" /></div>
                <div><label className="label">Description</label><textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input resize-none" rows={2} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Date début</label><input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({...formData, start_date: e.target.value})} className="input" /></div>
                  <div><label className="label">Date fin</label><input type="date" value={formData.end_date || ''} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="input" /></div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
            <button onClick={closeModal} className="btn-ghost">Annuler</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Gestion du contenu</h1>
        <p className="text-slate-500">Gérez les actualités, FAQ, partenaires et timeline</p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-all
              ${activeTab === tab.id ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="card p-12 text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Chargement...</p>
        </div>
      )}

      {/* ACTUALITÉS */}
      {!loading && activeTab === 'news' && (
        <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">{news.length} actualité(s)</span>
            <button onClick={() => openModal()} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Nouvelle</button>
          </div>
          {news.length === 0 ? (
            <div className="card p-8 text-center text-slate-400">Aucune actualité. Cliquez sur "Nouvelle" pour en créer une.</div>
          ) : news.map(n => (
            <div key={n.id} className="card p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0"><FileText className="w-6 h-6 text-primary-600" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 truncate">{n.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${n.status === 'published' ? 'bg-green-400/10 text-green-400' : 'bg-orange-400/10 text-orange-400'}`}>
                    {n.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 truncate">{n.content}</p>
                <p className="text-xs text-slate-900/30 mt-1">{n.published_at ? new Date(n.published_at).toLocaleDateString('fr-FR') : 'Non publié'}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(n)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-900"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(n.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* TIMELINE */}
      {!loading && activeTab === 'timeline' && (
        <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">{timeline.length} étape(s)</span>
            <button onClick={() => openModal()} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Nouvelle étape</button>
          </div>
          {timeline.length === 0 ? (
            <div className="card p-8 text-center text-slate-400">Aucune étape. Cliquez sur "Nouvelle étape" pour en créer une.</div>
          ) : timeline.sort((a,b) => a.phase_number - b.phase_number).map(t => (
            <div key={t.id} className={`card p-4 flex items-center gap-4 ${t.status === 'active' ? 'border-primary-200' : ''}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg
                ${t.status === 'active' ? 'bg-primary-500 text-slate-900' : t.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-slate-200 text-slate-400'}`}>
                {t.phase_number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{t.title}</h3>
                  {t.status === 'active' && <span className="px-2 py-0.5 rounded text-xs bg-primary-50 text-primary-600">En cours</span>}
                </div>
                <p className="text-sm text-slate-400">
                  {t.start_date && new Date(t.start_date).toLocaleDateString('fr-FR')} - {t.end_date && new Date(t.end_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(t)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-900"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* FAQ */}
      {!loading && activeTab === 'faq' && (
        <motion.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">{faqs.length} question(s)</span>
            <button onClick={() => openModal()} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Nouvelle FAQ</button>
          </div>
          {faqs.length === 0 ? (
            <div className="card p-8 text-center text-slate-400">Aucune FAQ. Cliquez sur "Nouvelle FAQ" pour en créer une.</div>
          ) : faqs.map(f => (
            <div key={f.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-slate-900">{f.question}</h3>
                  </div>
                  <p className="text-sm text-slate-500 ml-7">{f.answer}</p>
                  <span className="inline-block mt-2 ml-7 px-2 py-0.5 rounded text-xs bg-slate-200 text-slate-400">{f.category}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(f)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-900"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(f.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* PARTENAIRES */}
      {!loading && activeTab === 'partners' && (
        <motion.div key="partners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">{partners.length} partenaire(s)</span>
            <button onClick={() => openModal()} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Nouveau partenaire</button>
          </div>
          {partners.length === 0 ? (
            <div className="card p-8 text-center text-slate-400">Aucun partenaire. Cliquez sur "Nouveau partenaire" pour en ajouter.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map(p => (
                <div key={p.id} className="card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{p.name}</h3>
                      <span className="text-xs text-slate-400 capitalize">{p.type}</span>
                    </div>
                  </div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline flex items-center gap-1 truncate">
                      <ExternalLink className="w-3 h-3" />{p.url}
                    </a>
                  )}
                  <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-slate-100">
                    <button onClick={() => openModal(p)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-900"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {renderModal()}
    </div>
  )
}
