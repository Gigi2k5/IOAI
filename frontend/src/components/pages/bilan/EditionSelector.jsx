import { motion } from 'framer-motion'

const editions = [
  { year: 2024, country: 'Bulgarie', flag: '🇧🇬', city: 'Burgas' },
  { year: 2025, country: 'Chine', flag: '🇨🇳', city: 'Pékin' },
  { year: 2026, country: 'Émirats Arabes Unis', flag: '🇦🇪', city: 'Abu Dhabi' }
]

export default function EditionSelector({ activeYear, onYearChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-center">
      <div className="inline-flex flex-col sm:flex-row rounded-xl sm:rounded-full bg-slate-100 p-1.5 shadow-inner">
        {editions.map((edition) => (
          <button
            key={edition.year}
            onClick={() => onYearChange(edition.year)}
            className="relative px-6 py-3 sm:py-2.5 rounded-lg sm:rounded-full text-sm font-medium transition-colors"
          >
            {activeYear === edition.year && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary-500 rounded-lg sm:rounded-full shadow-md"
                transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
              />
            )}
            <span className={`relative z-10 flex items-center justify-center sm:justify-start gap-2 ${
              activeYear === edition.year ? 'text-white' : 'text-slate-600 hover:text-slate-900'
            }`}>
              <span className="text-lg">{edition.flag}</span>
              <span className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                <span className="font-semibold">{edition.year}</span>
                <span className={`text-xs sm:text-sm ${
                  activeYear === edition.year ? 'text-white/80' : 'text-slate-500'
                }`}>
                  {edition.city}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
