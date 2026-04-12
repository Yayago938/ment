import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import CommitteeDashboard from './pages/CommitteeDashboard'
import CommitteeDetail from './pages/CommitteeDetail'
import CommitteeProfile from './pages/CommitteeProfile'
import CommitteeProfileEdit from './pages/CommitteeProfileEdit'
import CreateEvent from './pages/CreateEvent'
import ApplicationTracker from './pages/ApplicationTracker'
import EditStudentProfile from './pages/EditStudentProfile'
import EventDetails from './pages/EventDetails'
import EventRegistration from './pages/EventRegistration'
import ExploreCommunities from './pages/ExploreCommunities'
import FindingMatches from './pages/FindingMatches'
import InterestsQuestionnaire from './pages/InterestsQuestionnaire'
import MyApplications from './pages/MyApplications'
import Notifications from './pages/Notifications'
import OpportunityDetail from './pages/OpportunityDetail'
import PersonalizationIntro from './pages/PersonalizationIntro'
import Recommendations from './pages/Recommendations'
import SignUpLogin from './pages/SignUpLogin'
import StudentDashboard from './pages/StudentDashboard'
import StudentProfile from './pages/StudentProfile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<SignUpLogin />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/finding-matches" element={<FindingMatches />} />
      <Route path="/committee-detail" element={<CommitteeDetail />} />
      <Route path="/committee-detail/:id" element={<CommitteeDetail />} />
      <Route
        path="/committee/profile"
        element={
          <ProtectedRoute role="admin">
            <CommitteeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/profile/edit"
        element={
          <ProtectedRoute role="admin">
            <CommitteeProfileEdit />
          </ProtectedRoute>
        }
      />
      <Route path="/applications" element={<MyApplications />} />
      <Route path="/applications/tracker" element={<ApplicationTracker />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/explore" element={<ExploreCommunities />} />
      <Route path="/events/portfolio-review" element={<EventDetails />} />
      <Route path="/events/register" element={<EventRegistration />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route
        path="/committee/notifications"
        element={
          <ProtectedRoute role="admin">
            <Notifications variant="committee" />
          </ProtectedRoute>
        }
      />
      <Route path="/opportunities/product-design-internship" element={<OpportunityDetail />} />
      <Route path="/personalization-intro" element={<PersonalizationIntro />} />
      <Route path="/interests-questionnaire" element={<InterestsQuestionnaire />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/edit-student-profile" element={<EditStudentProfile />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/profile/edit" element={<EditStudentProfile />} />
      <Route
        path="/committee-dashboard"
        element={
          <ProtectedRoute role="admin">
            <CommitteeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/:id"
        element={
          <ProtectedRoute role="admin">
            <CommitteeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/new"
        element={
          <ProtectedRoute role="admin">
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route path="/onboarding" element={<Navigate to="/personalization-intro" replace />} />
      <Route path="/onboarding/interests" element={<Navigate to="/interests-questionnaire" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
