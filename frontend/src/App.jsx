import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layouts
import MainLayout from './components/layout/MainLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/layout/AdminLayout'

// Pages publiques
import HomePage from './components/pages/HomePage'
import AboutPage from './components/pages/AboutPage'
import Edition2026Page from './components/pages/Edition2026Page'
import BilanPage from './components/pages/BilanPage'
import ContactPage from './components/pages/ContactPage'
import FAQPage from './components/pages/FAQPage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'

// Pages légales et ressources (Phase 1)
import MentionsLegalesPage from './components/pages/MentionsLegalesPage'
import CGUPage from './components/pages/CGUPage'
import ConfidentialitePage from './components/pages/ConfidentialitePage'
import RessourcesPage from './components/pages/RessourcesPage'
import ClassementPage from './components/pages/ClassementPage'

// Pages authentification (Phase 2)
import ForgotPasswordPage from './components/pages/ForgotPasswordPage'
import ResetPasswordPage from './components/pages/ResetPasswordPage'
import VerifyEmailPage from './components/pages/VerifyEmailPage'

// Pages candidat
import DashboardPage from './components/pages/candidate/DashboardPage'
import ProfilePage from './components/pages/candidate/ProfilePage'
import QCMPage from './components/pages/candidate/QCMPage'
import ResultsPage from './components/pages/candidate/ResultsPage'

// Pages admin
import AdminDashboard from './components/pages/admin/AdminDashboard'
import CandidatesList from './components/pages/admin/CandidatesList'
import QuestionsManager from './components/pages/admin/QuestionsManager'
import ContentManager from './components/pages/admin/ContentManager'
import Statistics from './components/pages/admin/Statistics'

// Guards
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Routes publiques */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/edition-2026" element={<Edition2026Page />} />
          <Route path="/bilan" element={<BilanPage />} />
          <Route path="/bilan/:year" element={<BilanPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          
          {/* Pages légales et ressources (Phase 1) */}
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/cgu" element={<CGUPage />} />
          <Route path="/confidentialite" element={<ConfidentialitePage />} />
          <Route path="/ressources" element={<RessourcesPage />} />
          <Route path="/classement" element={<ClassementPage />} />
          
          {/* Pages authentification (Phase 2) */}
          <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
          <Route path="/reinitialiser-mot-de-passe" element={<ResetPasswordPage />} />
          <Route path="/verifier-email" element={<VerifyEmailPage />} />
        </Route>

        {/* Routes candidat (protégées) */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/tableau-de-bord" element={<DashboardPage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/qcm" element={<QCMPage />} />
          <Route path="/resultats" element={<ResultsPage />} />
        </Route>

        {/* Routes admin (protégées + rôle admin) */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/candidats" element={<CandidatesList />} />
          <Route path="/admin/questions" element={<QuestionsManager />} />
          <Route path="/admin/contenu" element={<ContentManager />} />
          <Route path="/admin/statistiques" element={<Statistics />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
