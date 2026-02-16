import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, Globe, Award, Cpu, User, Building2, GraduationCap, Landmark } from 'lucide-react'
import TimelineRound from './TimelineRound'
import PhotoGallery from './PhotoGallery'

// Données des modules de compétition 2025
const competitionRounds = [
  {
    name: 'Défi d\'équipe — "Future Factory"',
    description: 'Premier défi international d\'IA au monde construit sur de véritables robots incarnés (soutenu par Galbot)',
    stages: [
      {
        name: 'Phase de simulation',
        location: 'onsite',
        duration: '5 heures (4 août, 13:00–18:00)',
        description: 'Développement en cycle complet dans une usine virtuelle',
        tasks: [
          { name: 'Ingénierie pratique', type: 'robot' },
          { name: 'Travail d\'équipe full-stack', type: 'ML' },
          { name: 'Pensée industrielle', type: 'CV' }
        ]
      },
      {
        name: 'Phase de validation robot',
        location: 'onsite',
        duration: '1h30 (6 août, 16:30–18:00)',
        description: 'Top 10 équipes déploient sur de vrais robots Galbot',
        tasks: [
          { name: 'Déploiement robotique', type: 'robot' }
        ]
      }
    ]
  },
  {
    name: 'Concours individuel',
    description: 'Plateforme Bohrium de DP Technology avec LLM préconfiguré comme outil de soutien',
    stages: [
      {
        name: 'Stage à domicile',
        location: 'home',
        duration: '1er–30 juillet',
        description: '3 exercices pratiques non notés pour préparation',
        tasks: [
          { name: 'Exercices préparatoires', type: 'ML' }
        ]
      },
      {
        name: 'Défi sur site',
        location: 'onsite',
        duration: '2 jours × 6 heures (5–6 août)',
        description: '6 problèmes couvrant Machine Learning, NLP et Vision par ordinateur',
        tasks: [
          { name: 'Machine Learning', type: 'ML' },
          { name: 'NLP', type: 'NLP' },
          { name: 'Vision par ordinateur', type: 'CV' }
        ]
      }
    ]
  }
]

// Activités culturelles
const culturalActivities = [
  {
    date: '3 août',
    title: 'Découverte technologique',
    items: [
      'Visite de Zhongguancun',
      'Entreprises d\'IA',
      'Universités',
      'Forum "IA + Éducation"'
    ]
  },
  {
    date: '8 août',
    title: 'Networking',
    items: [
      'Événement "Mise en relation école-entreprise"'
    ]
  },
  {
    date: 'Durant le séjour',
    title: 'Culture chinoise',
    items: [
      'Grande Muraille',
      'Palais d\'Été',
      'Ateliers culture traditionnelle chinoise'
    ]
  }
]

export default function Edition2025() {
  return (
    <div className="space-y-12">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-8 md:p-12 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-5xl">🇨🇳</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">IOAI 2025</h2>
              <p className="text-white/80">Le plus grand concours mondial d'IA pour lycéens</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Lieu</p>
                <p className="font-semibold">Pékin, Chine</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Dates</p>
                <p className="font-semibold">2–9 août 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Pays</p>
                <p className="font-semibold">63 pays/territoires</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Participants</p>
                <p className="font-semibold">310 élèves</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Organisateur</p>
                <p className="text-sm text-white/90">
                  École nationale de Jour de Pékin (BNDS) — Une célébration mondiale de la jeunesse, 
                  de la technologie et de l'innovation avec 80 équipes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Nouveautés 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-teal-600" />
            </div>
            <h4 className="font-display font-semibold text-slate-800">
              Première mondiale
            </h4>
          </div>
          <p className="text-slate-600">
            Premier défi international d'IA construit sur de <span className="font-semibold text-teal-700">véritables robots incarnés</span> — 
            les équipes programment des robots Galbot pour des tâches industrielles réelles.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-display font-semibold text-slate-800">
              Modèle dual
            </h4>
          </div>
          <p className="text-slate-600">
            Première adoption du modèle <span className="font-semibold text-purple-700">"Équipe + Défis individuels"</span> — 
            évaluant à la fois les compétences collaboratives et individuelles.
          </p>
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
            Deux modules complémentaires : défi d'équipe robotique et concours individuel
          </p>
        </motion.div>
        <TimelineRound rounds={competitionRounds} />
      </section>

      {/* Activités culturelles */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">
            Activités culturelles et technologiques
          </h3>
          <p className="text-slate-600">
            Un programme riche au-delà de la compétition
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {culturalActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-3">
                <Calendar className="w-3.5 h-3.5" />
                {activity.date}
              </div>
              <h4 className="font-display font-semibold text-slate-800 mb-3">
                {activity.title}
              </h4>
              <ul className="space-y-2">
                {activity.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Landmark className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Distinctions */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-6">
            Distinctions & Résultats
          </h3>

          {/* Prix spéciaux */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-slate-800">
                  Prix de la Contribution Exceptionnelle
                </h4>
                <p className="text-sm text-slate-600">
                  Reconnaissance des contributions majeures à l'IOAI 2025
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-amber-200 shadow-sm">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-slate-800">M. Tian Jun</p>
                  <p className="text-xs text-slate-500">Principal, BNDS</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-amber-200 shadow-sm">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-slate-800">Dr. Mao Yong</p>
                  <p className="text-xs text-slate-500">Organisateur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats détaillés - Placeholder */}
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 mb-4">
              <Award className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-display font-semibold text-slate-700 mb-2">
              Résultats détaillés à venir
            </h4>
            <p className="text-slate-500 max-w-md mx-auto">
              Les tableaux complets des médailles de l'IOAI 2025 seront publiés 
              après la conclusion de l'événement en août 2025.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Programme GAITE */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl border border-primary-200 p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-slate-800">
              Programme GAITE
            </h4>
            <p className="text-sm text-slate-600">
              Global AI Talent Empowerment
            </p>
          </div>
        </div>
        <p className="text-slate-700 leading-relaxed">
          Le programme GAITE vise à autonomiser les talents en IA à l'échelle mondiale, 
          en offrant des opportunités de développement, de mentorat et de mise en réseau 
          aux participants les plus prometteurs de l'IOAI.
        </p>
      </motion.section>

      {/* Galerie Photos */}
      <section>
        <h3 className="text-2xl font-display font-bold text-slate-800 mb-6">
          Galerie photos
        </h3>
        <PhotoGallery year="2025" />
      </section>
    </div>
  )
}
