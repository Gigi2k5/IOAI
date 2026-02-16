import { motion } from 'framer-motion'
import { MapPin, Calendar, Building2, Plane, Shield, Users, GraduationCap, Clock } from 'lucide-react'
import PhotoGallery from './PhotoGallery'

const highlights = [
  {
    icon: Shield,
    title: 'Ville la plus sûre',
    description: 'Abu Dhabi est classée ville la plus sûre du monde pour la 8e année consécutive',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Users,
    title: '200+ nationalités',
    description: 'Une des villes les plus cosmopolites au monde avec plus de 200 nationalités résidentes',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Plane,
    title: 'Connectivité mondiale',
    description: '33% du monde à 4h de vol, 80% à 8h de vol — un hub idéal pour un événement international',
    color: 'bg-purple-100 text-purple-600'
  }
]

export default function Edition2026() {
  return (
    <div className="space-y-12">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-8 md:p-12 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
            <Clock className="w-4 h-4" />
            Prochaine édition
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-5xl">🇦🇪</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">IOAI 2026</h2>
              <p className="text-white/80">Abu Dhabi, Émirats Arabes Unis</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Lieu</p>
                <p className="font-semibold">Abu Dhabi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Dates</p>
                <p className="font-semibold">2–8 août 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Hôte</p>
                <p className="font-semibold">MBZUAI</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MBZUAI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-2">
              Université Mohamed bin Zayed d'Intelligence Artificielle
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              MBZUAI est la première université au monde dédiée à la recherche et à l'enseignement 
              supérieur en intelligence artificielle. Cette institution de niveau master propose 
              des programmes spécialisés en :
            </p>
            <div className="flex flex-wrap gap-2">
              {['Machine Learning', 'Vision par ordinateur', 'Traitement du langage naturel'].map((program, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium border border-primary-100"
                >
                  {program}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Points forts Abu Dhabi */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">
            Pourquoi Abu Dhabi ?
          </h3>
          <p className="text-slate-600">
            Un lieu idéal pour accueillir un événement international d'envergure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${highlight.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-display font-semibold text-slate-800 mb-2">
                  {highlight.title}
                </h4>
                <p className="text-sm text-slate-600">
                  {highlight.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Format à venir */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-8 md:p-12 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-6">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-display font-semibold text-slate-700 mb-3">
          Format de compétition à venir
        </h3>
        <p className="text-slate-500 max-w-lg mx-auto mb-6">
          Les détails du format de compétition, des épreuves et du programme sont 
          en cours de préparation par le comité organisateur de MBZUAI.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
          <Calendar className="w-4 h-4" />
          Informations disponibles courant 2026
        </div>
      </motion.div>

      {/* Galerie Photos */}
      <section>
        <h3 className="text-2xl font-display font-bold text-slate-800 mb-6">
          Galerie photos
        </h3>
        <PhotoGallery year="2026" />
      </section>
    </div>
  )
}
