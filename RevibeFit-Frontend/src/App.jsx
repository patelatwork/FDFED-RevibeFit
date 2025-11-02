import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './features/landing-page/pages/LandingPage'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'
import FitnessEnthusiastDashboard from './features/fitness-enthusiast/pages/Dashboard'
import TrainerDashboard from './features/trainer/pages/Dashboard'
import LabPartnerDashboard from './features/lab-partner/pages/Dashboard'

function App() {
  

  return (
    <>
      <Routes>
        {/* Routes without Navbar and Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Routes with Navbar and Footer */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                
                {/* Dashboard Routes */}
                <Route path="/fitness-enthusiast/dashboard" element={<FitnessEnthusiastDashboard />} />
                <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
                <Route path="/lab-partner/dashboard" element={<LabPartnerDashboard />} />
                
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
