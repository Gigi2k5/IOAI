import { motion } from 'framer-motion'
import { Brain, Target, Users, Globe, Award, Sparkles, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const values = [
  { icon: Target, title: 'Excellence', desc: 'Nous visons les plus hauts standards en matière d\'IA et de compétition internationale.' },
  { icon: Users, title: 'Collaboration', desc: 'Nous croyons en la force du travail d\'équipe et du partage de connaissances.' },
  { icon: Globe, title: 'Ouverture', desc: 'Nous accueillons tous les talents, quelle que soit leur origine ou leur parcours.' },
  { icon: Sparkles, title: 'Innovation', desc: 'Nous encourageons la créativité et les nouvelles approches en intelligence artificielle.' },
]

export default function AboutPage() {
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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              À propos
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Les Olympiades d'<span className="text-gradient">Intelligence Artificielle</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Une compétition internationale qui rassemble les meilleurs talents en IA de plus de 60 pays, 
              pour résoudre des défis complexes et repousser les limites de l'innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Les Olympiades internationales d'Intelligence Artificielle (IOAI) ont pour mission de 
                promouvoir l'excellence en IA parmi les jeunes talents du monde entier.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Pour le Bénin, c'est l'opportunité unique de faire rayonner nos talents sur la scène 
                internationale et de les préparer aux défis technologiques de demain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/inscription">
                  <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
                    Rejoindre l'aventure
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/edition-2026">
                  <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
                    Voir le programme 2026
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-teal-500 rounded-3xl p-8 text-white">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Bilan des éditions</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-3xl font-bold">30ᵉ</p>
                      <p className="text-sm text-white/70">Rang 2025</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-3xl font-bold">3</p>
                      <p className="text-sm text-white/70">Éditions IOAI</p>
                    </div>
                  </div>
                  <Link to="/bilan">
                    <button className="w-full py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-white/90 transition-colors">
                      Voir toutes les éditions
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-lg text-slate-600">
              Les principes qui guident notre engagement envers les jeunes talents béninois.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm text-slate-600">{value.desc}</p>
              </motion.div>
            ))}
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
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Prêt à représenter le Bénin ?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Rejoignez les Olympiades d'IA 2026 et faites partie de l'aventure.
            </p>
            <Link to="/inscription">
              <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                S'inscrire maintenant
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
