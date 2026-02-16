import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Code, 
  Calculator, 
  Lightbulb, 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  ExternalLink, 
  Rocket,
  GraduationCap,
  Sparkles
} from 'lucide-react'

const themes = [
  {
    icon: Lightbulb,
    title: 'Logique',
    description: 'Raisonnement logique, suites numériques, problèmes de logique combinatoire et déductive.',
    topics: ['Suites et séquences', 'Syllogismes', 'Puzzles logiques', 'Raisonnement déductif'],
    color: 'primary'
  },
  {
    icon: Code,
    title: 'Algorithmique',
    description: 'Bases de la programmation, structures de données, complexité algorithmique.',
    topics: ['Tri et recherche', 'Structures de données', 'Complexité (O notation)', 'Graphes basiques'],
    color: 'teal'
  },
  {
    icon: Calculator,
    title: 'Mathématiques',
    description: 'Arithmétique, algèbre, probabilités et statistiques de niveau secondaire.',
    topics: ['Arithmétique (PGCD, puissances)', 'Combinatoire', 'Probabilités', 'Dérivées et fonctions'],
    color: 'accent'
  },
  {
    icon: Brain,
    title: 'Intelligence Artificielle',
    description: 'Concepts fondamentaux du machine learning et des réseaux de neurones.',
    topics: ['Types d\'apprentissage', 'Réseaux de neurones', 'Overfitting/Underfitting', 'Applications IA'],
    color: 'deep'
  }
]

const conseils = [
  {
    icon: Clock,
    title: 'Gérez votre temps',
    description: 'Vous avez 30 minutes pour 20 questions. Ne restez pas bloqué plus de 2 minutes sur une question difficile.'
  },
  {
    icon: Target,
    title: 'Lisez attentivement',
    description: 'Prenez le temps de bien comprendre chaque question avant de répondre. Les détails comptent.'
  },
  {
    icon: CheckCircle,
    title: 'Éliminez les mauvaises réponses',
    description: 'Quand vous hésitez, éliminez d\'abord les réponses clairement fausses pour augmenter vos chances.'
  },
  {
    icon: BookOpen,
    title: 'Révisez les fondamentaux',
    description: 'Consolidez vos bases en mathématiques et logique. Ce sont les compétences les plus testées.'
  },
  {
    icon: Sparkles,
    title: 'Restez calme',
    description: 'Le stress diminue vos performances. Respirez profondément et faites confiance à vos connaissances.'
  }
]

const ressourcesExternes = [
  {
    title: 'Khan Academy - Algèbre',
    url: 'https://fr.khanacademy.org/math/algebra',
    description: 'Cours gratuits de mathématiques'
  },
  {
    title: 'Brilliant.org',
    url: 'https://brilliant.org/',
    description: 'Problèmes de logique et mathématiques interactifs'
  },
  {
    title: 'France-IOI',
    url: 'https://www.france-ioi.org/',
    description: 'Entraînement à l\'algorithmique'
  },
  {
    title: 'Machine Learning Crash Course',
    url: 'https://developers.google.com/machine-learning/crash-course',
    description: 'Introduction au ML par Google'
  },
  {
    title: '3Blue1Brown',
    url: 'https://www.3blue1brown.com/',
    description: 'Vidéos explicatives sur les mathématiques et l\'IA'
  },
  {
    title: 'Codecademy - Python',
    url: 'https://www.codecademy.com/learn/learn-python-3',
    description: 'Apprendre les bases de la programmation'
  }
]

const getColorClasses = (color) => {
  const colors = {
    primary: {
      bg: 'bg-[#206080]/10',
      text: 'text-[#206080]',
      border: 'border-[#206080]/20'
    },
    teal: {
      bg: 'bg-[#208080]/10',
      text: 'text-[#208080]',
      border: 'border-[#208080]/20'
    },
    accent: {
      bg: 'bg-[#20A080]/10',
      text: 'text-[#20A080]',
      border: 'border-[#20A080]/20'
    },
    deep: {
      bg: 'bg-[#204080]/10',
      text: 'text-[#204080]',
      border: 'border-[#204080]/20'
    }
  }
  return colors[color] || colors.primary
}

export default function RessourcesPage() {
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
              <GraduationCap className="w-4 h-4" />
              Préparation au QCM
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Ressources de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C0E0E0] to-white">
                préparation
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Découvrez les thèmes abordés au Test National et préparez-vous efficacement 
              avec nos conseils et ressources recommandées.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Thèmes abordés */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#206080]/10 text-[#206080] text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Programme
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Thèmes abordés au QCM
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Le Test National évalue vos compétences dans 4 domaines clés. 
              Voici ce que vous devez maîtriser.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {themes.map((theme, index) => {
              const colorClasses = getColorClasses(theme.color)
              return (
                <motion.div
                  key={theme.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center flex-shrink-0`}>
                      <theme.icon className={`w-6 h-6 ${colorClasses.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-semibold text-slate-900 mb-2">
                        {theme.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        {theme.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {theme.topics.map((topic) => (
                          <span
                            key={topic}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Conseils de préparation */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#208080]/10 text-[#208080] text-sm font-medium mb-4">
              <Lightbulb className="w-4 h-4" />
              Conseils
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Conseils pour réussir
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Nos recommandations pour maximiser vos chances de réussite au Test National.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {conseils.map((conseil, index) => (
              <motion.div
                key={conseil.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-[#206080]/10 flex items-center justify-center mb-4">
                  <conseil.icon className="w-5 h-5 text-[#206080]" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 mb-2">
                  {conseil.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {conseil.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Liens utiles */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#20A080]/10 text-[#20A080] text-sm font-medium mb-4">
              <ExternalLink className="w-4 h-4" />
              Ressources externes
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Liens utiles
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Des ressources en ligne gratuites pour approfondir vos connaissances.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ressourcesExternes.map((ressource, index) => (
              <motion.a
                key={ressource.title}
                href={ressource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#206080] hover:bg-[#206080]/5 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-[#206080]/30">
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#206080]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 group-hover:text-[#206080] truncate">
                    {ressource.title}
                  </h3>
                  <p className="text-sm text-slate-500 truncate">
                    {ressource.description}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#206080] to-[#208080] flex items-center justify-center mb-8 shadow-lg">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Prêt à relever le défi ?
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Inscrivez-vous maintenant pour participer au Test National de sélection 
              et tenter de représenter le Bénin aux Olympiades Internationales d'IA.
            </p>
            <Link
              to="/inscription"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#206080] to-[#208080] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Rocket className="w-5 h-5" />
              Je m'inscris maintenant
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
