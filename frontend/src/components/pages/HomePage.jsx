import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Brain, ArrowRight, Users, Trophy, Calendar, ChevronRight, Star, Target, Globe, Award, Clock, MapPin, GraduationCap, Rocket, TrendingUp, CheckCircle, Sparkles, ExternalLink, Newspaper } from 'lucide-react'

// Compteur animé
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  useEffect(() => {
    if (!isInView) return
    const end = parseInt(target.toString().replace(/\D/g, '')) || 0
    let start = 0
    const timer = setInterval(() => {
      start += Math.ceil(end / 40)
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [isInView, target])
  return <span ref={ref}>{count.toLocaleString('fr-FR')}{suffix}</span>
}

// Compte à rebours
function Countdown({ targetDate }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff > 0) setTime({
        d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000)
      })
    }
    calc(); const t = setInterval(calc, 1000); return () => clearInterval(t)
  }, [targetDate])
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {[['d','Jours'],['h','Heures'],['m','Min'],['s','Sec']].map(([k,l], i) => (
        <div key={k} className="text-center">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-slate-100">
            <span className="text-2xl sm:text-3xl font-display font-bold text-primary-600">{String(time[k]).padStart(2,'0')}</span>
          </div>
          <span className="text-xs text-white/80 mt-2 block">{l}</span>
        </div>
      ))}
    </div>
  )
}

const stats = [
  { value: 743, label: 'Candidats 2026', icon: Users, color: 'primary' },
  { value: 30, label: 'Rang mondial', icon: Trophy, suffix: 'ᵉ', color: 'accent' },
  { value: 60, label: 'Pays participants', icon: Globe, color: 'teal' },
  { value: 6, label: 'Phases de sélection', icon: Target, color: 'deep' },
]

const timeline = [
  { phase: 1, title: 'Inscription', date: '24 Fév - 9 Mars', status: 'active' },
  { phase: 2, title: 'Test National', date: '15 Mars', status: 'upcoming' },
  { phase: 3, title: 'Présélection', date: 'Avril', status: 'upcoming' },
  { phase: 4, title: 'Formation', date: 'Mai-Juin', status: 'upcoming' },
  { phase: 5, title: 'Sélection', date: 'Juillet', status: 'upcoming' },
  { phase: 6, title: 'Olympiades', date: 'Août', status: 'upcoming' },
]

const testimonials = [
  { name: 'Merveille Agbossaga', role: 'Mention Honorable 2025', quote: 'Une expérience incroyable qui a transformé ma vision de l\'IA et ouvert de nouvelles perspectives.', avatar: '🏆' },
  { name: "Déreck M'po Yeti", role: 'Participant 2025', quote: 'Les Olympiades m\'ont permis de rencontrer des talents du monde entier et de me dépasser.', avatar: '🌟' },
  { name: 'Dona Christ Ahouansou', role: 'Participant 2025', quote: 'La formation intensive m\'a donné des compétences uniques en IA.', avatar: '💡' },
]

const features = [
  { icon: Brain, title: 'Intelligence Artificielle', desc: 'Maîtrisez les fondamentaux de l\'IA et du machine learning.' },
  { icon: Target, title: 'Compétition Mondiale', desc: 'Affrontez les meilleurs talents de plus de 60 pays.' },
  { icon: GraduationCap, title: 'Formation d\'Excellence', desc: 'Bénéficiez d\'un accompagnement par des experts.' },
  { icon: Rocket, title: 'Opportunités Uniques', desc: 'Ouvrez les portes des meilleures universités mondiales.' },
]

const actualites = [
  {
    tag: 'IOAI 2026',
    tagType: 'ioai',
    emoji: '🇦🇪',
    title: "L'inscription à l'IOAI 2026 à Abu Dhabi est officiellement ouverte",
    summary: "Les comités nationaux peuvent procéder au processus d'inscription pour la prochaine Olympiade à Abu Dhabi, aux Émirats arabes unis.",
    url: 'https://ioai-official.org/ioai-2026-abu-dhabi-registration-officially-open/'
  },
  {
    tag: 'IOAI 2026',
    tagType: 'ioai',
    emoji: '💰',
    title: "Aide financière 2026 : Soutenir la participation mondiale à l'IOAI",
    summary: "Le programme offre un soutien aux déplacements et/ou l'exonération des frais de participation pour certaines équipes nationales.",
    url: 'https://ioai-official.org/financial-aid-2026/'
  },
  {
    tag: 'AOAI 2026',
    tagType: 'aoai',
    emoji: '🇹🇳',
    title: "La Tunisie confirmée comme pays hôte de l'AOAI 2026",
    summary: "Le Conseil d'administration de l'AOAI a officiellement confirmé que la Tunisie accueillera l'Olympiade africaine d'intelligence artificielle 2026.",
    url: 'https://ioai-official.org/tunisia-confirmed-as-host-country-for-aoai-2026/'
  },
  {
    tag: 'AOAI 2026',
    tagType: 'aoai',
    emoji: '🌍',
    title: "L'AOAI 2026 se tiendra à Sousse, Tunisie, du 9 au 12 avril 2026",
    summary: "L'AOAI servira de qualification africaine pour l'IOAI et sera organisée sous forme d'événement hybride.",
    url: 'https://www.africa-oai.org/'
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/90 via-deep-500/90 to-teal-500/90" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                Inscriptions ouvertes jusqu'au 9 mars
              </motion.div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Représentez le <span className="text-light-300">Bénin</span> aux Olympiades d'IA 2026
              </h1>
              
              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                Rejoignez l'aventure internationale et faites rayonner le talent béninois sur la scène mondiale de l'intelligence artificielle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/inscription">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-5 h-5" />
                    Je m'inscris maintenant
                  </motion.button>
                </Link>
                <Link to="/edition-2026">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    En savoir plus
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 to-teal-400/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-8">
                    <p className="text-white/60 text-sm mb-2">Clôture des inscriptions dans</p>
                    <Countdown targetDate="2026-03-09T23:59:59" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                      <Users className="w-8 h-8 text-light-300 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">743+</p>
                      <p className="text-xs text-white/60">Inscrits</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                      <Trophy className="w-8 h-8 text-light-300 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">30ᵉ</p>
                      <p className="text-xs text-white/60">Rang 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  stat.color === 'accent' ? 'bg-accent-100 text-accent-600' :
                  stat.color === 'teal' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix || ''} />
                </div>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Pourquoi participer ?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Une opportunité <span className="text-gradient">exceptionnelle</span>
            </h2>
            <p className="text-lg text-slate-600">
              Les Olympiades internationales d'IA sont bien plus qu'une compétition. C'est une porte ouverte vers l'excellence.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:border-primary-200 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              Calendrier 2026
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Les <span className="text-gradient-accent">6 phases</span> de sélection
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeline.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  item.status === 'active' 
                    ? 'bg-primary-50 border-primary-300 shadow-lg' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg ${
                    item.status === 'active' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {item.phase}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-primary-600 font-medium">{item.date}</p>
                    {item.status === 'active' && (
                      <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                        En cours
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/edition-2026">
              <button className="btn-secondary inline-flex items-center gap-2">
                Voir le programme complet
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BILAN 2025 */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-primary-500 via-deep-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                <Trophy className="w-4 h-4" />
                Beijing 2025
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Une première participation <span className="text-light-300">historique</span>
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Pour sa première participation aux Olympiades internationales d'IA à Beijing, le Bénin s'est illustré parmi les 60 nations participantes.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-light-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">30ᵉ place mondiale</p>
                    <p className="text-sm text-white/60">Sur 87 équipes de 60 pays</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-light-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">700+ candidats</p>
                    <p className="text-sm text-white/60">Mobilisés au niveau national</p>
                  </div>
                </div>
              </div>
              
              <Link to="/bilan/2025">
                <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2">
                  Voir le bilan des éditions
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <span className="text-5xl">🇧🇯</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-light-300" />
                    <span className="text-white font-medium">Beijing, Chine</span>
                  </div>
                  <div className="text-6xl font-display font-bold text-white mb-2">30ᵉ</div>
                  <p className="text-white/60 mb-6">sur 87 équipes</p>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-light-300 fill-light-300' : 'text-white/30'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-light-300 mt-2 font-medium">Mention Honorable</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              <Newspaper className="w-4 h-4" />
              Actualités
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Dernières <span className="text-gradient">actualités</span>
            </h2>
            <p className="text-lg text-slate-600">
              Restez informés des dernières nouvelles de l'IOAI et de l'AOAI
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actualites.map((actu, i) => (
              <motion.a
                key={i}
                href={actu.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    actu.tagType === 'ioai' 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'bg-accent-50 text-accent-700'
                  }`}>
                    {actu.tag}
                  </span>
                  <span className="text-2xl">{actu.emoji}</span>
                </div>
                
                <h3 className="font-display font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {actu.title}
                </h3>
                
                <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                  {actu.summary}
                </p>
                
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 group-hover:underline">
                  Lire la suite
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </motion.a>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a 
              href="https://ioai-official.org/news/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Voir toutes les actualités
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Témoignages
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Ils ont vécu <span className="text-gradient">l'aventure</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{item.avatar}</div>
                <p className="text-slate-600 mb-6 italic">"{item.quote}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-primary-600">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mb-8 shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Prêt à relever le <span className="text-gradient">défi</span> ?
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Rejoignez les Olympiades d'IA 2026 et écrivez la prochaine page de l'histoire du Bénin dans le domaine de l'intelligence artificielle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inscription">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Je m'inscris maintenant
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-300 hover:border-slate-400 transition-all"
                >
                  Poser une question
                </motion.button>
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-500 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Inscriptions ouvertes jusqu'au 9 mars 2026
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
