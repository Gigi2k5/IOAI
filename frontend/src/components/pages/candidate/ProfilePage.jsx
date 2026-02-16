import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../../store/AuthContext'
import { 
  User, School, Save, CheckCircle, Camera, X, Mail, MapPin, Phone, 
  Users, AlertCircle, Send, Clock, XCircle, FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../services/api'
import FileUpload from '../../common/FileUpload'
import SchoolAutocomplete from '../../common/SchoolAutocomplete'

// Composant de recadrage d'image simple
function ImageCropper({ image, onCrop, onCancel }) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e) => {
    isDragging.current = true
    lastPos.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    setPosition({ x: e.clientX - lastPos.current.x, y: e.clientY - lastPos.current.y })
  }

  const handleMouseUp = () => { isDragging.current = false }

  const handleCrop = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = image
    img.onload = () => {
      canvas.width = 200
      canvas.height = 200
      const size = Math.min(img.width, img.height) / scale
      const sx = (img.width - size) / 2 - (position.x / scale)
      const sy = (img.height - size) / 2 - (position.y / scale)
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200)
      onCrop(canvas.toDataURL('image/jpeg', 0.9))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-lg font-semibold text-slate-900">Recadrer la photo</h3>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div 
          ref={containerRef}
          className="relative w-64 h-64 mx-auto rounded-full overflow-hidden bg-slate-50 cursor-move border-4 border-[#206080]/20"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={image}
            alt="Aperçu"
            className="absolute w-full h-full object-cover"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transformOrigin: 'center'
            }}
            draggable={false}
          />
          <div className="absolute inset-0 border-4 border-slate-300 rounded-full pointer-events-none" />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-slate-600 mb-2">Zoom</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full accent-[#206080]"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleCrop}
            className="flex-1 py-2.5 bg-[#206080] text-white rounded-xl hover:bg-[#185068] transition-colors"
          >
            Valider
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateUser, checkAuth, isVerified } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState(user?.candidate?.photo_url || null)
  const [cropImage, setCropImage] = useState(null)
  const [school, setSchool] = useState({
    id: user?.candidate?.school_id || null,
    name: user?.candidate?.school_name || '',
    city: user?.candidate?.school_city || '',
    region: user?.candidate?.region || ''
  })
  const [bulletins, setBulletins] = useState({
    t1: user?.candidate?.bulletin_t1_url || null,
    t2: user?.candidate?.bulletin_t2_url || null,
    t3: user?.candidate?.bulletin_t3_url || null
  })
  const fileInputRef = useRef(null)

  const candidateStatus = user?.candidate?.status || 'draft'
  const isProfileComplete = user?.candidate?.is_profile_complete

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.candidate?.first_name || '',
      lastName: user?.candidate?.last_name || '',
      birthDate: user?.candidate?.birth_date || '',
      gender: user?.candidate?.gender || '',
      email: user?.email || '',
      phone: user?.candidate?.phone || '',
      address: user?.candidate?.address || '',
      city: user?.candidate?.city || '',
      region: user?.candidate?.region || '',
      parentName: user?.candidate?.parent_name || '',
      parentPhone: user?.candidate?.parent_phone || '',
      parentRelation: user?.candidate?.parent_relation || '',
      classLevel: user?.candidate?.class_level || '',
      averageT1: user?.candidate?.average_t1 || '',
      averageT2: user?.candidate?.average_t2 || '',
      averageT3: user?.candidate?.average_t3 || '',
      mathAverage: user?.candidate?.math_average || '',
      scienceAverage: user?.candidate?.science_average || '',
      schoolCity: user?.candidate?.school_city || ''
    }
  })

  const birthDate = watch('birthDate')
  const isMinor = birthDate ? (new Date().getFullYear() - new Date(birthDate).getFullYear()) < 18 : true

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image trop volumineuse (max 5 Mo)')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => setCropImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleCrop = async (croppedImage) => {
    setCropImage(null)
    
    // Afficher immédiatement l'image localement
    setProfileImage(croppedImage)
    toast.success('Photo mise à jour')
    
    // Tenter l'upload en arrière-plan
    try {
      const response = await fetch(croppedImage)
      const blob = await response.blob()
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
      
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResponse = await api.post('/candidate/profile/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      if (uploadResponse.data.success && uploadResponse.data.data.photo_url) {
        // Mettre à jour avec l'URL du serveur
        setProfileImage(uploadResponse.data.data.photo_url)
      }
    } catch (error) {
      console.error('Upload error:', error)
      // La photo reste affichée localement, pas besoin de toast d'erreur
    }
  }

  const handleSchoolChange = (schoolData) => {
    setSchool(schoolData)
    if (schoolData.city) {
      setValue('schoolCity', schoolData.city)
    }
    if (schoolData.region) {
      setValue('region', schoolData.region)
    }
  }

  const handleBulletinUpload = async (file, trimestre) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('trimestre', trimestre)
    
    const response = await api.post('/candidate/profile/upload-bulletin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    if (response.data.success) {
      const url = response.data.data.bulletin_url
      setBulletins(prev => ({ ...prev, [`t${trimestre}`]: url }))
      return url
    }
    throw new Error('Erreur upload bulletin')
  }

  const onSubmit = async (data) => {
    if (!school.name) {
      toast.error('Veuillez sélectionner un établissement')
      return
    }
    if (isMinor && (!data.parentName || !data.parentPhone)) {
      toast.error('Contact parent/tuteur obligatoire pour les mineurs')
      return
    }

    setIsLoading(true)
    
    try {
      const profileData = {
        first_name: data.firstName,
        last_name: data.lastName,
        birth_date: data.birthDate,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        city: data.city,
        region: data.region || school.region,
        parent_name: data.parentName,
        parent_phone: data.parentPhone,
        parent_relation: data.parentRelation,
        school_id: school.id,
        school_name: school.name,
        school_city: data.schoolCity || school.city,
        class_level: data.classLevel,
        average_t1: data.averageT1 ? parseFloat(data.averageT1) : null,
        average_t2: data.averageT2 ? parseFloat(data.averageT2) : null,
        average_t3: data.averageT3 ? parseFloat(data.averageT3) : null,
        math_average: data.mathAverage ? parseFloat(data.mathAverage) : null,
        science_average: data.scienceAverage ? parseFloat(data.scienceAverage) : null,
      }
      
      const response = await api.put('/candidate/profile', profileData)
      
      if (response.data.success) {
        const updatedCandidate = response.data.data
        updateUser({
          candidate: updatedCandidate,
          name: `${updatedCandidate.first_name} ${updatedCandidate.last_name}`
        })
        toast.success('Profil enregistré avec succès !')
      } else {
        toast.error(response.data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error.response?.data?.error || 'Erreur lors de la sauvegarde du profil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitCandidature = async () => {
    if (!isProfileComplete) {
      toast.error('Veuillez d\'abord compléter votre profil')
      return
    }
    if (!isVerified) {
      toast.error('Veuillez vérifier votre email avant de soumettre')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await api.post('/candidate/profile/submit')
      
      if (response.data.success) {
        toast.success('Candidature soumise avec succès ! Elle sera examinée par un administrateur.')
        await checkAuth()
      } else {
        toast.error(response.data.error || 'Erreur lors de la soumission')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error.response?.data?.error || 'Erreur lors de la soumission')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {cropImage && (
        <ImageCropper
          image={cropImage}
          onCrop={handleCrop}
          onCancel={() => setCropImage(null)}
        />
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Mon Profil</h1>
        <p className="text-slate-500">Complétez vos informations pour participer aux Olympiades.</p>
      </motion.div>

      {/* Bannière de statut */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {candidateStatus === 'draft' && (
          <div className={`p-4 rounded-xl border ${isProfileComplete ? 'bg-[#206080]/5 border-[#206080]/20' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {isProfileComplete ? (
                <>
                  <CheckCircle className="w-5 h-5 text-[#206080] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#206080]">Profil complet !</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Vous pouvez maintenant soumettre votre candidature pour validation.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-700">Profil incomplet</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Complétez tous les champs obligatoires (*) pour pouvoir soumettre votre candidature.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {candidateStatus === 'submitted' && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-700">Candidature en cours d'examen</p>
                <p className="text-sm text-slate-500 mt-1">
                  Votre candidature est en attente de validation par un administrateur.
                </p>
              </div>
            </div>
          </div>
        )}

        {candidateStatus === 'validated' && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-700">Candidature validée !</p>
                <p className="text-sm text-slate-500 mt-1">
                  Félicitations ! Vous pouvez maintenant passer le QCM de sélection.
                </p>
              </div>
            </div>
          </div>
        )}

        {candidateStatus === 'rejected' && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-700">Candidature refusée</p>
                <p className="text-sm text-slate-500 mt-1">
                  {user?.candidate?.rejection_reason || 'Votre candidature n\'a pas été retenue.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#206080]" />
            Photo d'identité
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-[#206080]/10 overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-300" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#206080] flex items-center justify-center shadow-lg hover:bg-[#185068] transition-colors"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-slate-600 mb-2">Format recommandé : photo d'identité</p>
              <p className="text-sm text-slate-400">JPG, PNG, WEBP - Max 5 Mo</p>
            </div>
          </div>
        </motion.div>

        {/* Informations personnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[#206080]" />
            Informations personnelles
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Prénom *</label>
              <input 
                {...register('firstName', { required: 'Prénom requis' })} 
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080] ${errors.firstName ? 'border-red-300' : 'border-slate-200'}`} 
                placeholder="Votre prénom" 
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nom *</label>
              <input 
                {...register('lastName', { required: 'Nom requis' })} 
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080] ${errors.lastName ? 'border-red-300' : 'border-slate-200'}`} 
                placeholder="Votre nom" 
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date de naissance *</label>
              <input 
                type="date" 
                {...register('birthDate', { required: 'Date de naissance requise' })} 
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080] ${errors.birthDate ? 'border-red-300' : 'border-slate-200'}`} 
              />
              {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Genre *</label>
              <select 
                {...register('gender', { required: 'Genre requis' })} 
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080] ${errors.gender ? 'border-red-300' : 'border-slate-200'}`}
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>
          </div>
        </motion.div>

        {/* Coordonnées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#206080]" />
            Coordonnées
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  {...register('email')} 
                  disabled 
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone *</label>
              <input 
                type="tel" 
                {...register('phone', { required: 'Téléphone requis' })} 
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080] ${errors.phone ? 'border-red-300' : 'border-slate-200'}`} 
                placeholder="+229 XX XX XX XX" 
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ville *</label>
              <input 
                {...register('city', { required: 'Ville requise' })} 
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080] ${errors.city ? 'border-red-300' : 'border-slate-200'}`} 
                placeholder="Votre ville" 
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
              <input 
                {...register('address')} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080]" 
                placeholder="Votre adresse complète" 
              />
            </div>
          </div>
        </motion.div>

        {/* Contact parent/tuteur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#206080]" />
            Contact parent/tuteur
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {isMinor ? 'Obligatoire pour les candidats mineurs.' : 'Facultatif pour les candidats majeurs.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom du parent/tuteur {isMinor && '*'}
              </label>
              <input 
                {...register('parentName', { required: isMinor ? 'Requis pour les mineurs' : false })} 
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080] ${errors.parentName ? 'border-red-300' : 'border-slate-200'}`} 
                placeholder="Nom complet" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Téléphone {isMinor && '*'}
              </label>
              <input 
                type="tel" 
                {...register('parentPhone', { required: isMinor ? 'Requis pour les mineurs' : false })} 
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080] ${errors.parentPhone ? 'border-red-300' : 'border-slate-200'}`} 
                placeholder="+229 XX XX XX XX" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lien de parenté {isMinor && '*'}
              </label>
              <select 
                {...register('parentRelation', { required: isMinor ? 'Requis' : false })} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080]"
              >
                <option value="">Sélectionner</option>
                <option value="pere">Père</option>
                <option value="mere">Mère</option>
                <option value="tuteur">Tuteur légal</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Informations scolaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <School className="w-5 h-5 text-[#206080]" />
            Informations scolaires
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <SchoolAutocomplete
                value={school.name}
                onChange={handleSchoolChange}
                error={null}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ville de l'établissement</label>
              <input 
                {...register('schoolCity')} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080]" 
                placeholder="Ville de l'école" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Région</label>
              <select 
                {...register('region')} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080]"
              >
                <option value="">Sélectionner</option>
                <option value="Alibori">Alibori</option>
                <option value="Atacora">Atacora</option>
                <option value="Atlantique">Atlantique</option>
                <option value="Borgou">Borgou</option>
                <option value="Collines">Collines</option>
                <option value="Couffo">Couffo</option>
                <option value="Donga">Donga</option>
                <option value="Littoral">Littoral</option>
                <option value="Mono">Mono</option>
                <option value="Ouémé">Ouémé</option>
                <option value="Plateau">Plateau</option>
                <option value="Zou">Zou</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Classe *</label>
              <select 
                {...register('classLevel', { required: 'Classe requise' })} 
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080] ${errors.classLevel ? 'border-red-300' : 'border-slate-200'}`}
              >
                <option value="">Sélectionner</option>
                <option value="3eme">3ème</option>
                <option value="2nde">2nde</option>
                <option value="1ere">1ère</option>
                <option value="Tle">Terminale</option>
              </select>
              {errors.classLevel && <p className="text-red-500 text-sm mt-1">{errors.classLevel.message}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-4">
              Moyennes générales des 3 derniers trimestres
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Trimestre 1</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="20" 
                  {...register('averageT1', { min: 0, max: 20 })} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-center focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080]" 
                  placeholder="--/20" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Trimestre 2</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="20" 
                  {...register('averageT2', { min: 0, max: 20 })} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-center focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080]" 
                  placeholder="--/20" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Trimestre 3</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="20" 
                  {...register('averageT3', { min: 0, max: 20 })} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-center focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080]" 
                  placeholder="--/20" 
                />
              </div>
            </div>
          </div>

          {/* Moyennes maths et sciences */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-4">
              Moyennes par matière (optionnel)
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Moyenne en Mathématiques</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="20" 
                  {...register('mathAverage', { min: 0, max: 20 })} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080]" 
                  placeholder="Ex: 14.50" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Moyenne en Sciences</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="20" 
                  {...register('scienceAverage', { min: 0, max: 20 })} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#206080]/20 focus:border-[#206080]" 
                  placeholder="Ex: 13.00" 
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Documents scolaires - Bulletins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#206080]" />
            Documents scolaires
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Uploadez vos bulletins au format PDF (max 10 MB chacun)
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <FileUpload
              accept=".pdf"
              maxSize={10 * 1024 * 1024}
              label="Bulletin T1"
              currentFile={bulletins.t1}
              onUpload={(file) => handleBulletinUpload(file, 1)}
              onRemove={() => setBulletins(prev => ({ ...prev, t1: null }))}
              preview="document"
            />
            <FileUpload
              accept=".pdf"
              maxSize={10 * 1024 * 1024}
              label="Bulletin T2"
              currentFile={bulletins.t2}
              onUpload={(file) => handleBulletinUpload(file, 2)}
              onRemove={() => setBulletins(prev => ({ ...prev, t2: null }))}
              preview="document"
            />
            <FileUpload
              accept=".pdf"
              maxSize={10 * 1024 * 1024}
              label="Bulletin T3"
              currentFile={bulletins.t3}
              onUpload={(file) => handleBulletinUpload(file, 3)}
              onRemove={() => setBulletins(prev => ({ ...prev, t3: null }))}
              preview="document"
            />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">* Champs obligatoires</p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Bouton Enregistrer - toujours visible si draft */}
              {candidateStatus === 'draft' && (
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Enregistrer
                    </>
                  )}
                </motion.button>
              )}

              {/* Bouton Soumettre - visible si profil complet et statut draft */}
              {candidateStatus === 'draft' && isProfileComplete && (
                <motion.button
                  type="button"
                  onClick={handleSubmitCandidature}
                  disabled={isSubmitting || !isVerified}
                  whileHover={isVerified ? { scale: 1.02 } : {}}
                  whileTap={isVerified ? { scale: 0.98 } : {}}
                  className={`flex items-center justify-center gap-2 px-6 py-3 bg-[#206080] text-white font-medium rounded-xl hover:bg-[#185068] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${!isVerified ? 'cursor-not-allowed' : ''}`}
                  title={!isVerified ? 'Vous devez vérifier votre email avant de soumettre' : ''}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Soumettre ma candidature
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Message si email non vérifié */}
          {candidateStatus === 'draft' && isProfileComplete && !isVerified && (
            <p className="text-sm text-amber-600 text-center sm:text-right">
              ⚠️ Vous devez vérifier votre email avant de pouvoir soumettre votre candidature.
            </p>
          )}

          {/* Message d'aide si profil incomplet */}
          {candidateStatus === 'draft' && !isProfileComplete && (
            <p className="text-sm text-amber-500 text-center sm:text-right">
              Complétez tous les champs obligatoires pour pouvoir soumettre votre candidature.
            </p>
          )}
        </motion.div>
      </form>
    </div>
  )
}