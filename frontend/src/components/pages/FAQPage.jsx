import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, Search, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const defaultFaqs = [
  { question: "Qui peut participer aux Olympiades IA ?", answer: "Tout élève du secondaire âgé de 14 à 18 ans et résidant au Bénin peut s'inscrire aux Olympiades d'Intelligence Artificielle." },
  { question: "L'inscription est-elle payante ?", answer: "Non, l'inscription et la participation aux Olympiades IA sont entièrement gratuites." },
  { question: "Comment se déroule la sélection ?", answer: "La sélection se fait en plusieurs phases : inscription, test QCM national, présélection, formation intensive, et sélection finale de l'équipe nationale." },
  { question: "Quelles connaissances préalables sont nécessaires ?", answer: "Des bases en mathématiques et en logique sont recommandées. La connaissance de Python est un plus mais n'est pas obligatoire pour l'inscription." },
]

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-900 pr-4">{faq.question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState(defaultFaqs)
  const [openIndex, setOpenIndex] = useState(0)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/content/faq')
        if (res.data.data?.length > 0) {
          setFaqs(res.data.data)
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      }
    }
    fetchFaqs()
  }, [])

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Centre d'aide
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Questions <span className="text-gradient">fréquentes</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Trouvez rapidement les réponses à vos questions sur les Olympiades IA.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une question..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <FAQItem 
                  faq={faq}
                  isOpen={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune question trouvée pour "{search}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-slate-600 mb-8">
              Notre équipe est disponible pour répondre à toutes vos questions.
            </p>
            <Link to="/contact">
              <button className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
                Nous contacter
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
