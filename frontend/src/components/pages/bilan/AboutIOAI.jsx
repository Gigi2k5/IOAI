import { motion } from 'framer-motion'
import { Target, Eye, Lightbulb, History, Globe, Users } from 'lucide-react'

// Pays fondateurs de l'IOAI
const foundingCountries = [
  'Allemagne', 'Australie', 'Autriche', 'Brésil', 'Bulgarie', 'Canada', 
  'Chine', 'Colombie', 'Corée du Sud', 'Égypte', 'Émirats Arabes Unis', 
  'Estonie', 'Hong Kong', 'Hongrie', 'Inde', 'Indonésie', 'Iran', 
  'Japon', 'Jordanie', 'Macao', 'Malaisie', 'Mongolie', 'Pays-Bas', 
  'Pologne', 'Roumanie', 'Singapour', 'Tunisie', 'Turquie', 'USA', 
  'Vietnam', 'Letovo (Russie)', 'Philippines', 'Royaume-Uni'
]

// Objectifs du programme GAITE
const gaiteObjectives = [
  'Inspirer les jeunes talents du monde entier dans le domaine de l\'IA',
  'Offrir des opportunités de développement et de mentorat',
  'Créer un réseau mondial de futurs leaders en IA',
  'Favoriser la collaboration internationale',
  'Démocratiser l\'accès à l\'éducation en IA'
]

export default function AboutIOAI() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Titre de section */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800 mb-4">
          À propos de l'IOAI
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Les Olympiades Internationales d'Intelligence Artificielle : une compétition 
          mondiale pour inspirer la prochaine génération de talents en IA
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl border border-primary-200 p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800">Mission</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">
            L'IOAI vise à <span className="font-semibold text-primary-700">inspirer les jeunes du monde entier</span> dans 
            la science, en se concentrant sur l'intelligence artificielle. Elle encourage l'excellence, 
            la créativité et la collaboration internationale dans ce domaine en pleine expansion.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <Eye className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800">Vision</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">
            L'IOAI aspire à devenir une <span className="font-semibold text-teal-700">Olympiade internationale des sciences 
            au même niveau</span> que les compétitions établies comme les Olympiades de Mathématiques, 
            de Physique et d'Informatique.
          </p>
        </motion.div>
      </div>

      {/* Programme GAITE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-accent-500 to-teal-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold">Programme GAITE</h3>
              <p className="text-white/80">Global AI Talent Empowerment</p>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-slate-700 mb-6 leading-relaxed">
            Le programme GAITE (Global AI Talent Empowerment) est une initiative clé de l'IOAI 
            visant à autonomiser les talents en IA à l'échelle mondiale. Ses objectifs :
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {gaiteObjectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent-100 text-accent-700 text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-sm text-slate-700">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Histoire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center">
            <History className="w-6 h-6 text-slate-600" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-800">Histoire</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="text-4xl font-display font-bold text-primary-600 mb-2">2024</div>
            <p className="text-sm text-slate-600">Première édition à Burgas, Bulgarie</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-display font-bold text-primary-600 mb-2">41</div>
            <p className="text-sm text-slate-600">Équipes participantes</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-display font-bold text-primary-600 mb-2">6</div>
            <p className="text-sm text-slate-600">Continents représentés</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            <span className="font-semibold text-slate-800">Record historique :</span> L'IOAI 2024 a établi 
            le record du plus grand nombre de pays participants lors de la première édition d'une Olympiade 
            scientifique internationale, avec <span className="font-semibold text-primary-600">32 pays et territoires</span>.
          </p>
        </div>
      </motion.div>

      {/* Pays fondateurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-slate-800">Pays fondateurs</h3>
            <p className="text-sm text-slate-600">33 pays et territoires à l'origine de l'IOAI</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {foundingCountries.map((country, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors"
            >
              {country}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Partenaires - Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 mb-4">
          <Users className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-display font-semibold text-slate-700 mb-2">
          Partenaires
        </h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          La liste des partenaires officiels de l'IOAI sera bientôt disponible.
        </p>
      </motion.div>
    </motion.section>
  )
}
