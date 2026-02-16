import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

const medalStyles = {
  'Or': {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: '🥇'
  },
  'Argent': {
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-600',
    icon: '🥈'
  },
  'Bronze': {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: '🥉'
  }
}

export default function MedalTable({ title, columns, rows, medalKey = 'medal', description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-slate-800">{title}</h3>
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIndex) => {
              const medal = row[medalKey]
              const style = medalStyles[medal] || {}
              
              return (
                <tr
                  key={rowIndex}
                  className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-primary-50/30 transition-colors`}
                >
                  {columns.map((col, colIndex) => {
                    const value = row[col.key]
                    
                    // Colonne médaille
                    if (col.key === medalKey) {
                      return (
                        <td key={colIndex} className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.border} ${style.text} border`}>
                            <span>{style.icon}</span>
                            {value}
                          </span>
                        </td>
                      )
                    }
                    
                    // Colonne score (numérique)
                    if (col.type === 'score') {
                      return (
                        <td key={colIndex} className="px-4 py-3 font-mono text-sm text-slate-700">
                          {value !== null && value !== undefined && value !== '—' ? value.toFixed?.(2) || value : '—'}
                        </td>
                      )
                    }
                    
                    // Colonne rang
                    if (col.type === 'rank') {
                      return (
                        <td key={colIndex} className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                            {value}
                          </span>
                        </td>
                      )
                    }
                    
                    // Colonne équipe (première colonne généralement)
                    if (col.type === 'team') {
                      return (
                        <td key={colIndex} className="px-4 py-3 font-medium text-slate-800">
                          {value}
                        </td>
                      )
                    }
                    
                    // Colonne par défaut
                    return (
                      <td key={colIndex} className="px-4 py-3 text-sm text-slate-600">
                        {value ?? '—'}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden divide-y divide-slate-100">
        {rows.map((row, rowIndex) => {
          const medal = row[medalKey]
          const style = medalStyles[medal] || {}
          const teamCol = columns.find(c => c.type === 'team')
          const rankCol = columns.find(c => c.type === 'rank')
          
          return (
            <div key={rowIndex} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {rankCol && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                      {row[rankCol.key]}
                    </span>
                  )}
                  {teamCol && (
                    <span className="font-medium text-slate-800">{row[teamCol.key]}</span>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.border} ${style.text} border`}>
                  <span>{style.icon}</span>
                  {medal}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {columns
                  .filter(c => c.type !== 'team' && c.type !== 'rank' && c.key !== medalKey)
                  .map((col, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="text-slate-500">{col.label}:</span>
                      <span className={`${col.type === 'score' ? 'font-mono' : ''} text-slate-700`}>
                        {row[col.key] !== null && row[col.key] !== undefined ? (
                          col.type === 'score' && typeof row[col.key] === 'number' 
                            ? row[col.key].toFixed(2) 
                            : row[col.key]
                        ) : '—'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
