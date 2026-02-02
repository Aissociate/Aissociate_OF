import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminFloatingButton from './components/AdminFloatingButton';
import OrganismHome from './pages/OrganismHome';
import FormationsList from './pages/FormationsList';
import FormationDetail from './pages/FormationDetail';
import FormationDetailPage from './pages/FormationDetailPage';
import Assistance from './pages/Assistance';
import Development from './pages/Development';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import Contact from './pages/Contact';
import Formulaire from './pages/Formulaire';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './pages/ApplicationForm';
import Quiz from './pages/Quiz';
import AudioRecording from './pages/AudioRecording';
import Rejected from './pages/Rejected';
import CreateAdmin from './pages/CreateAdmin';
import AdminDashboard from './pages/AdminDashboard';
import AdminKPIDashboard from './pages/AdminKPIDashboard';
import AdminProspectsSearch from './pages/AdminProspectsSearch';
import AdminFinancingTracker from './pages/AdminFinancingTracker';
import NewFixerDashboard from './pages/NewFixerDashboard';
import NewCloserDashboard from './pages/NewCloserDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Formation from './pages/Formation';
import ContinuousImprovement from './components/onboarding/ContinuousImprovement';
import VisionFunnel from './pages/formation/VisionFunnel';
import CadreLegalQualiopi from './pages/formation/CadreLegalQualiopi';
import FonctionnementCRM from './pages/formation/FonctionnementCRM';
import ProgrammeFormation from './pages/formation/ProgrammeFormation';
import ObjectionsCourantes from './pages/formation/ObjectionsCourantes';
import CadreCPF from './pages/formation/CadreCPF';
import ScriptExplications from './pages/formation/ScriptExplications';
import ModesFinancement from './pages/formation/ModesFinancement';
import ScriptCloserCPF from './pages/formation/ScriptCloserCPF';
import QualiopiDashboard from './pages/QualiopiDashboard';
import QualiopiTrainees from './pages/QualiopiTrainees';
import QualiopiTrainings from './pages/QualiopiTrainings';
import QualiopiSessions from './pages/QualiopiSessions';
import QualiopiSessionDetail from './pages/QualiopiSessionDetail';
import QualiopiLogs from './pages/QualiopiLogs';
import QualiopiSecretsCheck from './pages/QualiopiSecretsCheck';
import QuestionnairePublic from './pages/QuestionnairePublic';
import DiagnosticAuth from './pages/DiagnosticAuth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminFloatingButton />
        <Routes>
          <Route path="/" element={<OrganismHome />} />
          <Route path="/formations" element={<FormationsList />} />
          <Route path="/formations/closer-ia-cpf" element={<FormationDetail />} />
          <Route path="/formations/:id" element={<FormationDetailPage />} />
          <Route path="/assistance" element={<Assistance />} />
          <Route path="/developpement" element={<Development />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/formulaire" element={<Formulaire />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-admin" element={<CreateAdmin />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding/formulaire"
            element={
              <ProtectedRoute requireStatus={['new_user']}>
                <ApplicationForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding/questionnaire"
            element={
              <ProtectedRoute requireStatus={['new_user', 'pending_quiz']}>
                <Quiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding/enregistrement"
            element={
              <ProtectedRoute requireStatus={['new_user', 'pending_audio']}>
                <AudioRecording />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding/rejected"
            element={
              <ProtectedRoute requireStatus={['rejected']}>
                <Rejected />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding/dashboard/fixer"
            element={
              <ProtectedRoute requireStatus={['active']}>
                <NewFixerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding/dashboard/closer"
            element={
              <ProtectedRoute requireStatus={['active']}>
                <NewCloserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding/amelioration"
            element={
              <ProtectedRoute requireStatus={['active']}>
                <ContinuousImprovement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation"
            element={
              <ProtectedRoute>
                <Formation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation/vision-funnel"
            element={
              <ProtectedRoute>
                <VisionFunnel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation/cadre-legal-qualiopi"
            element={
              <ProtectedRoute>
                <CadreLegalQualiopi />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation/fonctionnement-crm"
            element={
              <ProtectedRoute>
                <FonctionnementCRM />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation/programme-formation"
            element={
              <ProtectedRoute>
                <ProgrammeFormation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation/objections-courantes"
            element={
              <ProtectedRoute>
                <ObjectionsCourantes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation/cadre-cpf"
            element={
              <ProtectedRoute>
                <CadreCPF />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation/script-explications"
            element={
              <ProtectedRoute>
                <ScriptExplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation/modes-financement"
            element={
              <ProtectedRoute>
                <ModesFinancement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/formation/script-closer-cpf"
            element={
              <ProtectedRoute>
                <ScriptCloserCPF />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/kpis"
            element={
              <ProtectedRoute>
                <AdminKPIDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/prospects"
            element={
              <ProtectedRoute>
                <AdminProspectsSearch />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/financing"
            element={
              <ProtectedRoute>
                <AdminFinancingTracker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qualiopi"
            element={
              <ProtectedRoute>
                <QualiopiDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qualiopi/trainees"
            element={
              <ProtectedRoute>
                <QualiopiTrainees />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qualiopi/trainings"
            element={
              <ProtectedRoute>
                <QualiopiTrainings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qualiopi/sessions"
            element={
              <ProtectedRoute>
                <QualiopiSessions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qualiopi/sessions/:id"
            element={
              <ProtectedRoute>
                <QualiopiSessionDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qualiopi/logs"
            element={
              <ProtectedRoute>
                <QualiopiLogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qualiopi/secrets-check"
            element={
              <ProtectedRoute>
                <QualiopiSecretsCheck />
              </ProtectedRoute>
            }
          />

          <Route path="/q/:token" element={<QuestionnairePublic />} />
          <Route path="/diagnostic" element={<DiagnosticAuth />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
