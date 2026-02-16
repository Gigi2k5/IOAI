import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function PhotoGallery({ year }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)
  const [images, setImages] = useState([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState(new Set())

  // Charger le fichier index.json de l'édition
  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true)
      setError(false)
      setFailedImages(new Set())
      
      try {
        const response = await fetch(`/galerie/${year}/index.json`)
        if (!response.ok) throw new Error('Failed to fetch')
        
        const jsonData = await response.json()
        setData(jsonData)
        setImages(jsonData.images || [])
      } catch (err) {
        console.error('Error loading gallery:', err)
        setError(true)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    loadGallery()
  }, [year])

  // Gestion des erreurs d'image
  const handleImageError = (index) => {
    setFailedImages(prev => new Set([...prev, index]))
  }

  // Images valides (non échouées)
  const validImages = images.filter((_, index) => !failedImages.has(index))

  // Navigation lightbox
  const openLightbox = (index) => {
    // Trouver l'index dans validImages
    const validIndex = validImages.findIndex((img) => img === images[index])
    if (validIndex !== -1) {
      setActiveIndex(validIndex)
      setLightboxOpen(true)
    }
  }

  const closeLightbox = () => setLightboxOpen(false)

  const goToPrevious = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  const goToNext = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
      if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, validImages.length])

  // Skeleton de chargement
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-xl bg-slate-200 animate-pulse"
          />
        ))}
      </div>
    )
  }

  // Placeholder si erreur ou pas d'images
  if (error || validImages.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-8">
        <Camera className="w-12 h-12 text-slate-300 mb-4" />
        <p className="font-display text-lg text-slate-400 mb-1">Galerie photos</p>
        <p className="text-sm text-slate-400">Bientôt disponible</p>
      </div>
    )
  }

  return (
    <>
      {/* Grille de photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => {
          // Ne pas afficher les images en erreur
          if (failedImages.has(index)) return null

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
              className="group"
            >
              <button
                onClick={() => openLightbox(index)}
                className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl"
              >
                <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                  <img
                    src={`/galerie/${year}/${image.src}`}
                    alt={image.caption || `Photo ${index + 1} - IOAI ${year}`}
                    loading="lazy"
                    onError={() => handleImageError(index)}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </button>
              {image.caption && (
                <p className="text-sm text-slate-500 mt-2 px-1">{image.caption}</p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && validImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Bouton fermer */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation précédent */}
            {validImages.length > 1 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Image principale */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`/galerie/${year}/${validImages[activeIndex]?.src}`}
                alt={validImages[activeIndex]?.caption || `Photo ${activeIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              {validImages[activeIndex]?.caption && (
                <p className="mt-4 text-white text-center text-sm bg-black/50 px-4 py-2 rounded-lg">
                  {validImages[activeIndex].caption}
                </p>
              )}
              
              {/* Indicateur de position */}
              {validImages.length > 1 && (
                <div className="mt-4 flex items-center gap-2">
                  {validImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveIndex(i)
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === activeIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Navigation suivant */}
            {validImages.length > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
