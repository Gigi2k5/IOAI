import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, PieChart, TrendingUp, Download, Users, MapPin, School, 
  Calendar, Filter, FileText, Award, Target, Clock, CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

// Données simulées
const inscriptionsByRegion = [
  { name: 'Atlantique', total: 234, male: 138, female: 96 },
  { name: 'Littoral', total: 187, male: 102, female: 85 },
  { name: 'Ouémé', total: 112, male: 67, female: 45 },
  { name: 'Borgou', total: 89, male: 54, female: 35 },
  { name: 'Zou', total: 45, male: 28, female: 17 },
  { name: 'Collines', total: 38, male: 22, female: 16 },
  { name: 'Plateau', total: 21, male: 13, female: 8 },
  { name: 'Alibori', total: 17, male: 11, female: 6 },
]

const topSchools = [
  { name: 'Lycée Béhanzin', region: 'Atlantique', count: 45 },
  { name: 'CEG Dantokpa', region: 'Littoral', count: 38 },
  { name: 'Collège Notre Dame', region: 'Atlantique', count: 32 },
  { name: 'Lycée Toffa 1er', region: 'Ouémé', count: 28 },
  { name: 'CEG Gbégamey', region: 'Littoral', count: 25 },
]

const qcmStats = {
  totalAttempts: 289,
  avgScore: 68,
  passRate: 72,
  avgDuration: 24,
  scoreDistribution: [
    { range: '0-20', count: 12 },
    { range: '21-40', count: 28 },
    { range: '41-60', count: 67 },
    { range: '61-80', count: 112 },
    { range: '81-100', count: 70 },
  ]
}

const monthlyTrend = [
  { month: 'Jan', inscriptions: 0, qcm: 0 },
  { month: 'Fév', inscriptions: 456, qcm: 0 },
  { month: 'Mar', inscriptions: 287, qcm: 289 },
  { month: 'Avr', inscriptions: 0, qcm: 0 },
]

export default function Statistics() {
  const [dateRange, setDateRange] = useState('all')
  
  const totalInscriptions = inscriptionsByRegion.reduce((sum, r) => sum + r.total, 0)
  const totalMale = inscriptionsByRegion.reduce((sum, r) => sum + r.male, 0)
  const totalFemale = inscriptionsByRegion.reduce((sum, r) => sum + r.female, 0)
  const maxRegion = Math.max(...inscriptionsByRegion.map(r => r.total))

  const handleExportPDF = () => toast.success('Export PDF en cours...')
  const handleExportExcel = () => toast.success('Export Excel en cours...')

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Statistiques & Rapports</h1>
          <p className="text-slate-500">Analyse détaillée des inscriptions et performances</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input w-auto text-sm">
            <option value="all">Toute la période</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          <button onClick={handleExportPDF} className="btn-secondary text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={handleExportExcel} className="btn-primary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </motion.div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total inscrits', value: totalInscriptions, icon: Users, color: 'gold', change: '+12%' },
          { label: 'Taux réussite QCM', value: `${qcmStats.passRate}%`, icon: CheckCircle, color: 'green', change: '+5%' },
          { label: 'Score moyen', value: `${qcmStats.avgScore}/100`, icon: Target, color: 'blue', change: '+3pts' },
          { label: 'Durée moy. QCM', value: `${qcmStats.avgDuration}min`, icon: Clock, color: 'purple', change: '-2min' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card p-4 lg:p-6">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center
                ${stat.color === 'gold' ? 'bg-primary-50 text-primary-600' :
                  stat.color === 'green' ? 'bg-green-400/10 text-green-400' :
                  stat.color === 'blue' ? 'bg-blue-400/10 text-blue-400' :
                  'bg-purple-400/10 text-purple-400'}`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <span className="text-xs text-green-400 font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl lg:text-3xl font-display font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-xs lg:text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Par région */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="card p-6">
          <h3 className="font-display text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-primary-600" /> Inscriptions par département
          </h3>
          <div className="space-y-4">
            {inscriptionsByRegion.map((r, i) => (
              <div key={r.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-900/70">{r.name}</span>
                  <span className="text-slate-900 font-medium">{r.total} <span className="text-slate-400 text-xs">({Math.round(r.total/totalInscriptions*100)}%)</span></span>
                </div>
                <div className="h-6 bg-slate-200 rounded-full overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.male / maxRegion) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                    className="h-full bg-blue-500"
                    title={`Garçons: ${r.male}`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.female / maxRegion) * 100}%` }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                    className="h-full bg-pink-500"
                    title={`Filles: ${r.female}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-sm text-slate-500">Garçons ({totalMale})</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500" /><span className="text-sm text-slate-500">Filles ({totalFemale})</span></div>
          </div>
        </motion.div>

        {/* Distribution scores QCM */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="card p-6">
          <h3 className="font-display text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary-600" /> Distribution des scores QCM
          </h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {qcmStats.scoreDistribution.map((d, i) => {
              const maxCount = Math.max(...qcmStats.scoreDistribution.map(s => s.count))
              const height = (d.count / maxCount) * 100
              const color = i <= 1 ? 'from-red-500/50 to-red-500' : i === 2 ? 'from-orange-500/50 to-orange-500' : 'from-green-500/50 to-green-500'
              return (
                <div key={d.range} className="flex-1 flex flex-col items-center group">
                  <div className="text-xs text-slate-400 mb-1 opacity-0 group-hover:opacity-100">{d.count}</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                    className={`w-full bg-gradient-to-t ${color} rounded-t-lg`}
                  />
                  <span className="text-xs text-slate-400 mt-2">{d.range}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
            <div><div className="text-lg font-bold text-slate-900">{qcmStats.totalAttempts}</div><div className="text-xs text-slate-400">Tentatives</div></div>
            <div><div className="text-lg font-bold text-green-400">{qcmStats.passRate}%</div><div className="text-xs text-slate-400">Réussite</div></div>
            <div><div className="text-lg font-bold text-primary-600">{qcmStats.avgScore}</div><div className="text-xs text-slate-400">Score moy.</div></div>
          </div>
        </motion.div>
      </div>

      {/* Tableau top établissements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="card p-6">
        <h3 className="font-display text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
          <School className="w-5 h-5 text-primary-600" /> Top établissements
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left p-3 text-sm font-medium text-slate-400">#</th>
                <th className="text-left p-3 text-sm font-medium text-slate-400">Établissement</th>
                <th className="text-left p-3 text-sm font-medium text-slate-400">Département</th>
                <th className="text-right p-3 text-sm font-medium text-slate-400">Inscrits</th>
                <th className="text-right p-3 text-sm font-medium text-slate-400">%</th>
              </tr>
            </thead>
            <tbody>
              {topSchools.map((s, i) => (
                <tr key={s.name} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                      ${i === 0 ? 'bg-primary-500 text-slate-900' : i === 1 ? 'bg-gray-400 text-slate-900' : i === 2 ? 'bg-orange-600 text-slate-900' : 'bg-slate-200 text-slate-400'}`}>
                      {i + 1}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-900">{s.name}</td>
                  <td className="p-3 text-slate-500">{s.region}</td>
                  <td className="p-3 text-right font-semibold text-slate-900">{s.count}</td>
                  <td className="p-3 text-right text-slate-400">{Math.round(s.count/totalInscriptions*100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Répartition genre */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="card p-6">
          <h3 className="font-display text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-primary-600" /> Répartition par genre
          </h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#1E1B4B" strokeWidth="16" />
                <motion.circle cx="80" cy="80" r="70" fill="none" stroke="#3B82F6" strokeWidth="16" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 440" }}
                  animate={{ strokeDasharray: `${(totalMale/totalInscriptions)*440} 440` }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-bold text-slate-900">{totalInscriptions}</span>
                <span className="text-xs text-slate-400">Total</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <div className="text-2xl font-bold text-blue-400">{totalMale}</div>
              <div className="text-xs text-slate-400">Garçons ({Math.round(totalMale/totalInscriptions*100)}%)</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-pink-500/10">
              <div className="text-2xl font-bold text-pink-400">{totalFemale}</div>
              <div className="text-xs text-slate-400">Filles ({Math.round(totalFemale/totalInscriptions*100)}%)</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="lg:col-span-2 card p-6">
          <h3 className="font-display text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-600" /> Évolution mensuelle
          </h3>
          <div className="h-48 flex items-end justify-between gap-4">
            {monthlyTrend.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end" style={{ height: '160px' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.inscriptions / 500) * 100}%` }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="flex-1 bg-primary-500/60 rounded-t"
                    title={`Inscriptions: ${m.inscriptions}`}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.qcm / 500) * 100}%` }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="flex-1 bg-green-400/60 rounded-t"
                    title={`QCM: ${m.qcm}`}
                  />
                </div>
                <span className="text-sm text-slate-400">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary-500/60" /><span className="text-sm text-slate-500">Inscriptions</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-400/60" /><span className="text-sm text-slate-500">QCM passés</span></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
