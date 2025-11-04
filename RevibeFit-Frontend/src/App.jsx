import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './features/landing-page/pages/LandingPage'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'
import FitnessEnthusiastDashboard from './features/fitness-enthusiast/pages/Dashboard'
import TrainerDashboard from './features/trainer/pages/Dashboard'
import LabPartnerDashboard from './features/lab-partner/pages/Dashboard'
import AdminLogin from './features/admin/pages/AdminLogin'
import AdminDashboard from './features/admin/pages/AdminDashboard'
import PendingApprovals from './features/admin/pages/PendingApprovals'

function App() {
  

  return (
    <>
      <Routes>
        {/* Routes without Navbar and Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Routes (no navbar/footer) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pending-approvals" element={<PendingApprovals />} />

        {/* Trainer Dashboard (custom navbar, no footer) */}
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        
        {/* Lab Partner Dashboard (custom navbar, no footer) */}
        <Route path="/lab-partner/dashboard" element={<LabPartnerDashboard />} />

        {/* Fitness Enthusiast Dashboard (custom navbar with footer) */}
        <Route path="/fitness-enthusiast/dashboard" element={
          <>
            <FitnessEnthusiastDashboard />
            <Footer />
          </>
        } />

        {/* Routes with Navbar and Footer */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                
                {/* Add more routes here as needed */}
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  )
}

export default App
