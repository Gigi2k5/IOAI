import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Filter, Users, Medal, ChevronDown } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import api from '../../services/api'

const regions = [
  'Toutes les régions',
  'Alibori',
  'Atacora',
  'Atlantique',
  'Borgou',
  'Collines',
  'Couffo',
  'Donga',
  'Littoral',
  'Mono',
  'Ouémé',
  'Plateau',
  'Zou'
]

export default function ClassementPage() {
  const { user } = useAuth()
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true)
        setError(null)
        const params = selectedRegion !== 'Toutes les régions' 
          ? `?region=${encodeURIComponent(selectedRegion)}` 
          : ''
        const response = await api.get(`/rankings${params}`)
        if (response.data.success) {
          setRankings(response.data.data || [])
        } else {
          setError('Impossible de charger le classement')
        }
      } catch (err) {
        console.error('Erreur chargement classement:', err)
        // Si 404, le classement n'est pas encore disponible
        if (err.response?.status === 404) {
          setRankings([])
        } else {
          setError('Impossible de charger le classement')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [selectedRegion])

  // Identifier l'utilisateur actuel dans le classement
  const userCandidateHash = user?.candidate?.id 
    ? user.candidate.id.toString().substring(0, 6).padStart(6, '0')
    : null

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getRankBadgeClasses = (rank) => {
    if (rank === 1) return 'bg-amber-100 text-amber-700 border-amber-200'
    if (rank === 2) return 'bg-slate-100 text-slate-700 border-slate-300'
    if (rank === 3) return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-slate-50 text-slate-600 border-slate-200'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#206080] via-[#204080] to-[#208080] py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#20A080]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              Test National 2026
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Classement{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C0E0E0] to-white">
                national
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Découvrez le classement des candidats après le Test National de sélection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtre par région */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-5 h-5" />
                <span>
                  {loading ? '...' : `${rankings.length} candidat${rankings.length > 1 ? 's' : ''} classé${rankings.length > 1 ? 's' : ''}`}
                </span>
              </div>

              {/* Dropdown filtre */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 transition-colors"
                >
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span>{selectedRegion}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </button>

                {filterOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setFilterOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                      {regions.map((region) => (
                        <button
                          key={region}
                          onClick={() => {
                            setSelectedRegion(region)
                            setFilterOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            selectedRegion === region ? 'bg-[#206080]/5 text-[#206080] font-medium' : 'text-slate-700'
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-[#206080] rounded-full animate-spin" />
            </div>
          )}

          {/* Erreur */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-slate-600">{error}</p>
            </motion.div>
          )}

          {/* Pas de données */}
          {!loading && !error && rankings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <Trophy className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="font-display text-xl font-semibold text-slate-900 mb-3">
                Classement bientôt disponible
              </h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Le classement sera publié après le Test National prévu le 15 mars 2026.
                Inscrivez-vous dès maintenant pour participer !
              </p>
            </motion.div>
          )}

          {/* Tableau de classement */}
          {!loading && !error && rankings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Rang
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Identifiant
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Région
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((entry, index) => {
                      const isCurrentUser = userCandidateHash && entry.candidate_id_hash === userCandidateHash
                      const medal = getMedalEmoji(entry.rank)
                      
                      return (
                        <motion.tr
                          key={entry.candidate_id_hash || index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={`border-b border-slate-100 last:border-b-0 ${
                            isCurrentUser 
                              ? 'bg-[#206080]/5 border-l-4 border-l-[#206080]' 
                              : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {medal ? (
                                <span className="text-2xl">{medal}</span>
                              ) : (
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-semibold ${getRankBadgeClasses(entry.rank)}`}>
                                  {entry.rank}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-slate-700">
                              #{entry.candidate_id_hash}
                            </span>
                            {isCurrentUser && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#206080] text-white">
                                Vous
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {entry.region || '—'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-mono font-semibold text-slate-900">
                              {typeof entry.score === 'number' ? `${entry.score.toFixed(1)}%` : entry.score}
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Légende */}
          {!loading && !error && rankings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🥇</span>
                <span>1ère place</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🥈</span>
                <span>2ème place</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🥉</span>
                <span>3ème place</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
