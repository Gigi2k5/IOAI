import { useState, useEffect, useRef } from 'react'
import { Search, Building2, MapPin, Plus, ChevronDown } from 'lucide-react'

// Liste prédéfinie d'établissements
const SCHOOLS_LIST = [
  { id: 1, name: 'Lycée Béhanzin', city: 'Porto-Novo', region: 'Ouémé' },
  { id: 2, name: 'CEG Dantokpa', city: 'Cotonou', region: 'Littoral' },
  { id: 3, name: 'Lycée Technique de Cotonou', city: 'Cotonou', region: 'Littoral' },
  { id: 4, name: 'CEG Sainte Rita', city: 'Cotonou', region: 'Littoral' },
  { id: 5, name: 'Lycée Mathieu Bouké', city: 'Parakou', region: 'Borgou' },
  { id: 6, name: 'CEG 1 Parakou', city: 'Parakou', region: 'Borgou' },
  { id: 7, name: 'Lycée Toffa 1er', city: 'Porto-Novo', region: 'Ouémé' },
  { id: 8, name: 'CEG Gbégamey', city: 'Cotonou', region: 'Littoral' },
  { id: 9, name: 'Collège Notre Dame des Apôtres', city: 'Cotonou', region: 'Littoral' },
  { id: 10, name: 'Lycée Houffon', city: 'Cotonou', region: 'Littoral' },
  { id: 11, name: 'CEG Akpakpa', city: 'Cotonou', region: 'Littoral' },
  { id: 12, name: 'Lycée Coulibaly', city: 'Cotonou', region: 'Littoral' },
  { id: 13, name: 'CEG Zogbodomey', city: 'Zogbodomey', region: 'Zou' },
  { id: 14, name: 'Lycée de Lokossa', city: 'Lokossa', region: 'Mono' },
  { id: 15, name: 'CEG Abomey-Calavi', city: 'Abomey-Calavi', region: 'Atlantique' },
  { id: 16, name: 'Collège Père Aupiais', city: 'Cotonou', region: 'Littoral' },
  { id: 17, name: 'Lycée de Djougou', city: 'Djougou', region: 'Donga' },
  { id: 18, name: 'CEG Natitingou', city: 'Natitingou', region: 'Atacora' },
  { id: 19, name: 'Lycée de Kandi', city: 'Kandi', region: 'Alibori' },
  { id: 20, name: 'CEG Malanville', city: 'Malanville', region: 'Alibori' },
  { id: 21, name: 'Lycée Technique Agricole de Sékou', city: 'Allada', region: 'Atlantique' },
  { id: 22, name: 'CEG Ouidah', city: 'Ouidah', region: 'Atlantique' },
  { id: 23, name: 'Lycée des Jeunes Filles', city: 'Cotonou', region: 'Littoral' },
  { id: 24, name: 'CEG Bohicon', city: 'Bohicon', region: 'Zou' },
  { id: 25, name: 'Collège Catholique Notre Dame de Lourdes', city: 'Cotonou', region: 'Littoral' },
]

export default function SchoolAutocomplete({
  value = '',
  onChange,
  error = null
}) {
  const [query, setQuery] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [isManualMode, setIsManualMode] = useState(false)
  const [customSchool, setCustomSchool] = useState('')
  const containerRef = useRef(null)

  // Sync avec la valeur externe
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsManualMode(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtrer les écoles selon la recherche
  const filteredSchools = SCHOOLS_LIST.filter(school =>
    school.name.toLowerCase().includes(query.toLowerCase()) ||
    school.city.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelectSchool = (school) => {
    setQuery(school.name)
    setIsOpen(false)
    setIsManualMode(false)
    onChange({
      id: school.id,
      name: school.name,
      city: school.city,
      region: school.region
    })
  }

  const handleAddCustomSchool = () => {
    if (customSchool.trim()) {
      setQuery(customSchool.trim())
      setIsOpen(false)
      setIsManualMode(false)
      setCustomSchool('')
      onChange({
        id: null,
        name: customSchool.trim(),
        city: '',
        region: ''
      })
    }
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setQuery(newValue)
    setIsManualMode(false)
    if (!isOpen) setIsOpen(true)
    
    if (!newValue) {
      onChange({ name: '', id: null, city: '', region: '' })
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Établissement scolaire *
      </label>
      
      {/* Input avec bouton dropdown */}
      <div 
        className={`
          flex items-center gap-2 px-4 py-3 rounded-xl border bg-slate-50 cursor-pointer
          focus-within:ring-2 focus-within:ring-[#206080]/20 focus-within:border-[#206080]
          transition-all
          ${error ? 'border-red-300 bg-red-50' : 'border-slate-200'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          placeholder="Rechercher ou sélectionner un établissement..."
          className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400"
        />
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {/* Liste des écoles */}
          <div className="max-h-56 overflow-y-auto">
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school) => (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => handleSelectSchool(school)}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#206080]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-[#206080]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate text-sm">
                      {school.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {school.city}, {school.region}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                Aucun établissement trouvé
              </div>
            )}
          </div>
          
          {/* Section saisie manuelle */}
          <div className="border-t border-slate-200 bg-slate-50 p-3">
            {!isManualMode ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsManualMode(true)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-[#206080] hover:bg-[#206080]/5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Mon établissement n'est pas dans la liste
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 mb-2">Saisissez le nom de votre établissement :</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSchool}
                    onChange={(e) => setCustomSchool(e.target.value)}
                    placeholder="Nom de l'établissement"
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#206080]"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSchool}
                    disabled={!customSchool.trim()}
                    className="px-4 py-2 bg-[#206080] text-white text-sm font-medium rounded-lg hover:bg-[#185068] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}