import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, Globe, Award, Star } from 'lucide-react'
import MedalTable from './MedalTable'
import TimelineRound from './TimelineRound'
import PhotoGallery from './PhotoGallery'

// Données des rounds de compétition 2024
const competitionRounds = [
  {
    name: 'Ronde Scientifique',
    description: 'Évaluation des compétences techniques en IA',
    stages: [
      {
        name: 'Étape à domicile',
        location: 'home',
        duration: '1 mois',
        description: 'Travail préparatoire sur des problèmes complexes',
        tasks: [
          { name: 'NLP', type: 'NLP' },
          { name: 'Machine Learning', type: 'ML' },
          { name: 'Vision par ordinateur', type: 'CV' }
        ]
      },
      {
        name: 'Étape sur site',
        location: 'onsite',
        duration: '8 heures',
        description: 'Épreuve finale à Burgas',
        tasks: [
          { name: 'NLP', type: 'NLP' },
          { name: 'Machine Learning', type: 'ML' },
          { name: 'Vision par ordinateur', type: 'CV' }
        ]
      }
    ]
  },
  {
    name: 'Ronde Pratique',
    description: 'Application créative de l\'IA générative',
    stages: [
      {
        name: 'Étape sur site',
        location: 'onsite',
        duration: '4 heures',
        description: 'Création avec les outils d\'IA générative',
        tasks: [
          { name: 'Génération d\'images', type: 'image' },
          { name: 'Génération vidéo', type: 'video' }
        ]
      }
    ]
  }
]

// Résultats Ronde Scientifique
const scientificColumns = [
  { key: 'rank', label: 'Rang', type: 'rank' },
  { key: 'team', label: 'Équipe', type: 'team' },
  { key: 'score', label: 'Score', type: 'score' },
  { key: 'medal', label: 'Médaille' }
]

const scientificResults = [
  { rank: 1, team: 'Letovo', score: 99.04, medal: 'Or' },
  { rank: 2, team: 'Pologne 1', score: 75.93, medal: 'Or' },
  { rank: 3, team: 'Singapour 2', score: 68.31, medal: 'Or' },
  { rank: 4, team: 'Singapour 1', score: 64.86, medal: 'Or' },
  { rank: 5, team: 'Hongrie 2', score: 64.69, medal: 'Argent' },
  { rank: 6, team: 'Hongrie 1', score: 62.93, medal: 'Argent' },
  { rank: 7, team: 'Chine 1', score: 60.16, medal: 'Argent' },
  { rank: 8, team: 'Vietnam 2', score: 59.74, medal: 'Argent' },
  { rank: 9, team: 'Estonie', score: 59.09, medal: 'Argent' },
  { rank: 10, team: 'Mongolie', score: 56.57, medal: 'Argent' },
  { rank: 11, team: 'Chine 2', score: 54.11, medal: 'Argent' },
  { rank: 12, team: 'Roumanie 1', score: 50.23, medal: 'Bronze' },
  { rank: 13, team: 'Pologne 2', score: 49.60, medal: 'Bronze' },
  { rank: 14, team: 'Vietnam 1', score: 48.69, medal: 'Bronze' },
  { rank: 15, team: 'Colombie', score: 47.85, medal: 'Bronze' },
  { rank: 16, team: 'Malaisie', score: 45.89, medal: 'Bronze' },
  { rank: 17, team: 'Bulgarie 2', score: 44.03, medal: 'Bronze' },
  { rank: 18, team: 'Iran', score: 43.00, medal: 'Bronze' },
  { rank: 19, team: 'Roumanie 2', score: 42.64, medal: 'Bronze' },
  { rank: 20, team: 'Canada', score: 41.03, medal: 'Bronze' },
  { rank: 21, team: 'Bulgarie 1', score: 40.66, medal: 'Bronze' }
]

// Résultats Ronde Pratique
const practicalColumns = [
  { key: 'rank', label: 'Rang', type: 'rank' },
  { key: 'team', label: 'Équipe', type: 'team' },
  { key: 'juryScore', label: 'Score jury', type: 'score' },
  { key: 'peerScore', label: 'Score pairs', type: 'score' },
  { key: 'medal', label: 'Médaille' }
]

const practicalResults = [
  { rank: 1, team: 'Bulgarie 1', juryScore: 59.21, peerScore: 3.45, medal: 'Or' },
  { rank: 2, team: 'Pologne 1', juryScore: 60.30, peerScore: 3.20, medal: 'Or' },
  { rank: 3, team: 'Australie 2', juryScore: 59.88, peerScore: 3.13, medal: 'Or' },
  { rank: 4, team: 'USA 1', juryScore: 56.20, peerScore: 2.91, medal: 'Or' },
  { rank: 5, team: 'Émirats Arabes Unis', juryScore: 55.80, peerScore: 2.81, medal: 'Argent' },
  { rank: 6, team: 'Hongrie 1', juryScore: 53.15, peerScore: 2.80, medal: 'Argent' },
  { rank: 7, team: 'Hong Kong', juryScore: 55.77, peerScore: 2.80, medal: 'Argent' },
  { rank: 8, team: 'Canada', juryScore: 53.97, peerScore: 2.74, medal: 'Argent' },
  { rank: 9, team: 'Roumanie 2', juryScore: 52.65, peerScore: 2.71, medal: 'Argent' },
  { rank: 10, team: 'Letovo', juryScore: 54.63, peerScore: 2.66, medal: 'Argent' },
  { rank: 11, team: 'Chine 1', juryScore: 54.10, peerScore: 2.38, medal: 'Argent' },
  { rank: 12, team: 'Pays-Bas', juryScore: 52.37, peerScore: null, medal: 'Bronze' },
  { rank: 13, team: 'Jordanie', juryScore: 52.00, peerScore: null, medal: 'Bronze' },
  { rank: 14, team: 'Tunisie', juryScore: 51.80, peerScore: null, medal: 'Bronze' },
  { rank: 15, team: 'Macao', juryScore: 51.77, peerScore: null, medal: 'Bronze' },
  { rank: 16, team: 'Pologne 2', juryScore: 51.25, peerScore: null, medal: 'Bronze' },
  { rank: 17, team: 'Japon', juryScore: 50.90, peerScore: null, medal: 'Bronze' },
  { rank: 18, team: 'Colombie', juryScore: 50.83, peerScore: null, medal: 'Bronze' },
  { rank: 19, team: 'Vietnam 2', juryScore: 50.63, peerScore: null, medal: 'Bronze' },
  { rank: 20, team: 'Vietnam 1', juryScore: 49.80, peerScore: null, medal: 'Bronze' },
  { rank: 21, team: 'USA 2', juryScore: 49.60, peerScore: null, medal: 'Bronze' }
]

// Prix spéciaux
const specialAwards = [
  { rank: 1, team: 'Letovo' },
  { rank: 2, team: 'Pologne 1' },
  { rank: 3, team: 'Hongrie 1' }
]

export default function Edition2024() {
  return (
    <div className="space-y-12">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-deep-600 p-8 md:p-12 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-5xl">🇧🇬</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">IOAI 2024</h2>
              <p className="text-white/80">Première édition mondiale</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Lieu</p>
                <p className="font-semibold">Burgas, Bulgarie</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Dates</p>
                <p className="font-semibold">9–15 août 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Pays</p>
                <p className="font-semibold">30+ pays</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Équipes</p>
                <p className="font-semibold">40+ équipes</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/90">
                <span className="font-semibold">Record historique :</span> Plus grand nombre de pays participants 
                lors de la première édition d'une Olympiade scientifique internationale — 6 continents représentés.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Format de compétition */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">
            Format de la compétition
          </h3>
          <p className="text-slate-600">
            Deux rondes distinctes évaluant les compétences techniques et créatives
          </p>
        </motion.div>
        <TimelineRound rounds={competitionRounds} />
      </section>

      {/* Résultats */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">
            Résultats & Médailles
          </h3>
          <p className="text-slate-600">
            21 médailles décernées dans chaque ronde, plus 3 Prix Spéciaux de Performance Exceptionnelle
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Ronde Scientifique */}
          <MedalTable
            title="Ronde Scientifique"
            description="4 Or • 7 Argent • 10 Bronze"
            columns={scientificColumns}
            rows={scientificResults}
          />

          {/* Ronde Pratique */}
          <MedalTable
            title="Ronde Pratique"
            description="4 Or • 7 Argent • 10 Bronze"
            columns={practicalColumns}
            rows={practicalResults}
          />

          {/* Prix Spéciaux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-slate-800">
                  Prix Spéciaux de Performance Exceptionnelle
                </h4>
                <p className="text-sm text-slate-600">
                  Reconnaissance des performances globales exceptionnelles
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {specialAwards.map((award, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-amber-200 shadow-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-sm font-bold flex items-center justify-center">
                    {award.rank}
                  </span>
                  <span className="font-medium text-slate-800">{award.team}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Galerie Photos */}
      <section>
        <h3 className="text-2xl font-display font-bold text-slate-800 mb-6">
          Galerie photos
        </h3>
        <PhotoGallery year="2024" />
      </section>
    </div>
  )
}
