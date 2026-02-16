import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import api from '../../services/api'

export default function StaticPage({ slug }) {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get(`/pages/${slug}`)
        if (response.data.success) {
          setPage(response.data.data)
        } else {
          setError('Page non trouvée')
        }
      } catch (err) {
        console.error('Erreur chargement page:', err)
        setError('Page non trouvée')
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-white py-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Skeleton titre */}
          <div className="h-10 bg-slate-200 rounded-lg w-2/3 mb-8 animate-pulse" />
          {/* Skeleton contenu */}
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-4/5 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  // Erreur
  if (error) {
    return (
      <div className="min-h-screen bg-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 mb-4">
              Page non trouvée
            </h1>
            <p className="text-slate-500 mb-8">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#206080] text-white font-medium rounded-xl hover:bg-[#185068] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Titre */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
          {page.title}
        </h1>

        {/* Contenu */}
        <div
          className="prose prose-slate max-w-none
            prose-headings:font-display prose-headings:text-slate-900
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-a:text-[#206080] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900
            prose-ul:text-slate-600 prose-ol:text-slate-600
            prose-li:marker:text-slate-400"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Date de mise à jour */}
        {page.updated_at && (
          <p className="mt-12 pt-6 border-t border-slate-200 text-sm text-slate-400">
            Dernière mise à jour : {new Date(page.updated_at).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}

        {/* Lien retour */}
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#206080] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
