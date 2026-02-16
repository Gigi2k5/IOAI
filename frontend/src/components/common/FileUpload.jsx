import { useState, useRef } from 'react'
import { Upload, X, FileText, Eye, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function FileUpload({
  accept = '*',
  maxSize = 5 * 1024 * 1024,
  label = 'Fichier',
  currentFile = null,
  onUpload,
  onRemove,
  preview = 'document'
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(currentFile)
  const fileInputRef = useRef(null)

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getAcceptedFormats = () => {
    if (accept === 'image/*') return 'JPG, PNG, WEBP'
    if (accept === '.pdf') return 'PDF'
    if (accept.includes('image')) return 'Images'
    return accept
  }

  const validateFile = (file) => {
    setError(null)

    // Vérifier la taille
    if (file.size > maxSize) {
      setError(`Le fichier dépasse la taille maximale de ${formatFileSize(maxSize)}`)
      return false
    }

    // Vérifier le type
    if (accept === 'image/*') {
      if (!file.type.startsWith('image/')) {
        setError('Seules les images sont acceptées')
        return false
      }
    } else if (accept === '.pdf') {
      if (file.type !== 'application/pdf') {
        setError('Seuls les fichiers PDF sont acceptés')
        return false
      }
    }

    return true
  }

  const handleFile = async (file) => {
    if (!validateFile(file)) return

    try {
      setIsUploading(true)
      setError(null)
      const url = await onUpload(file)
      setUploadedFile(url)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Erreur lors de l\'upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
    // Reset input pour permettre de re-sélectionner le même fichier
    e.target.value = ''
  }

  const handleRemove = () => {
    setUploadedFile(null)
    setError(null)
    if (onRemove) onRemove()
  }

  // Affichage si fichier déjà uploadé
  if (uploadedFile && !isUploading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        
        {preview === 'image' ? (
          // Preview image (circulaire pour photo d'identité)
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-200 bg-slate-100">
              <img
                src={uploadedFile}
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleClick}
                className="text-sm text-[#206080] hover:underline"
              >
                Changer la photo
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="text-sm text-red-500 hover:underline"
              >
                Supprimer
              </button>
            </div>
          </div>
        ) : (
          // Preview document (PDF)
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {label}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Fichier uploadé
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={uploadedFile}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-[#206080] hover:bg-slate-100 rounded-lg transition-colors"
                title="Voir le fichier"
              >
                <Eye className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      {/* Zone de drop */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-[#206080] bg-[#206080]/5' 
            : 'border-slate-300 bg-slate-50 hover:border-[#206080] hover:bg-slate-100'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${isUploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[#206080] animate-spin" />
            <p className="text-sm text-slate-600">Upload en cours...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center mb-3">
              <Upload className={`w-6 h-6 ${isDragging ? 'text-[#206080]' : 'text-slate-400'}`} />
            </div>
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-medium text-[#206080]">Cliquez pour sélectionner</span>
              {' '}ou glissez un fichier
            </p>
            <p className="text-xs text-slate-400">
              {getAcceptedFormats()} • Max {formatFileSize(maxSize)}
            </p>
          </>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
