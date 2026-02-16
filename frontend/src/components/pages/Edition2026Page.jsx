import { motion } from 'framer-motion'
import { Calendar, Target, Users, BookOpen, Trophy, MapPin, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const phases = [
  { phase: 1, title: 'Inscriptions', date: '24 Fév - 9 Mars 2026', desc: 'Inscription en ligne gratuite pour tous les élèves du secondaire.', status: 'active' },
  { phase: 2, title: 'Test National', date: '15 Mars 2026', desc: 'QCM en ligne pour évaluer les connaissances en logique et IA.', status: 'upcoming' },
  { phase: 3, title: 'Présélection', date: 'Avril 2026', desc: 'Les 50 meilleurs candidats sont présélectionnés pour la formation.', status: 'upcoming' },
  { phase: 4, title: 'Formation Intensive', date: 'Mai - Juin 2026', desc: 'Programme de formation avec des experts en IA.', status: 'upcoming' },
  { phase: 5, title: 'Sélection Finale', date: 'Juillet 2026', desc: 'Épreuves pratiques pour former l\'équipe nationale de 4 membres.', status: 'upcoming' },
  { phase: 6, title: 'Olympiades Internationales', date: 'Août 2026', desc: 'Compétition mondiale avec les meilleures équipes de 60+ pays.', status: 'upcoming' },
]

const eligibility = [
  'Être élève du secondaire (3ème à Terminale)',
  'Avoir entre 14 et 18 ans au moment des Olympiades',
  'Être de nationalité béninoise ou résider au Bénin',
  'Avoir des bases en mathématiques et logique',
]

const topics = [
  { title: 'Logique & Raisonnement', desc: 'Résolution de problèmes, analyse logique' },
  { title: 'Mathématiques', desc: 'Algèbre, statistiques, probabilités' },
  { title: 'Algorithmique', desc: 'Conception d\'algorithmes, complexité' },
  { title: 'Machine Learning', desc: 'Apprentissage supervisé, non supervisé' },
  { title: 'Programmation Python', desc: 'Syntaxe, bibliothèques IA' },
  { title: 'Éthique de l\'IA', desc: 'Responsabilité, biais, impact social' },
]

export default function Edition2026Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              Édition 2026
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Programme <span className="text-gradient">complet</span>
            </h1>
            <p className="text-lg text-slate-600">
              Découvrez toutes les étapes pour représenter le Bénin aux Olympiades internationales d'IA 2026.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-slate-900 text-center mb-12"
          >
            Les 6 phases de sélection
          </motion.h2>
          <div className="space-y-6">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex gap-6 items-start p-6 rounded-2xl border-2 ${
                  phase.status === 'active' 
                    ? 'bg-primary-50 border-primary-200' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-xl flex-shrink-0 ${
                  phase.status === 'active' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {phase.phase}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-slate-900">{phase.title}</h3>
                    {phase.status === 'active' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                        En cours
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-2">{phase.desc}</p>
                  <p className="text-sm font-medium text-primary-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {phase.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-6">
                Conditions de participation
              </h2>
              <div className="space-y-4">
                {eligibility.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-accent-600" />
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/inscription">
                  <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
                    Vérifier mon éligibilité
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {topics.map((topic, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all">
                  <h3 className="font-semibold text-slate-900 mb-1">{topic.title}</h3>
                  <p className="text-sm text-slate-500">{topic.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-500 to-teal-500 rounded-3xl p-12 text-white"
          >
            <Trophy className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="font-display text-3xl font-bold mb-4">
              Prêt à relever le défi ?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Les inscriptions sont ouvertes jusqu'au 9 mars 2026. N'attendez plus pour rejoindre l'aventure !
            </p>
            <Link to="/inscription">
              <button className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-lg transition-all">
                S'inscrire maintenant
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
