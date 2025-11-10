import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './features/landing-page/pages/LandingPage'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'
import FitnessEnthusiastDashboard from './features/fitness-enthusiast/pages/Dashboard'
import FitnessEnthusiastNavbar from './features/fitness-enthusiast/components/FitnessEnthusiastNavbar'
import Trainers from './features/fitness-enthusiast/pages/Trainers'
import Blog from './features/fitness-enthusiast/pages/Blog'
import BlogDetail from './features/fitness-enthusiast/pages/BlogDetail'
import ReadBlogs from './features/fitness-enthusiast/pages/ReadBlogs'
import Care from './features/fitness-enthusiast/pages/Care'
import FitnessEnthusiastCare from './features/fitness-enthusiast/pages/FitnessEnthusiastCare'
import MyBookings from './features/fitness-enthusiast/pages/MyBookings'
import TrainerDashboard from './features/trainer/pages/Dashboard'
import UploadBlog from './features/trainer/pages/UploadBlog'
import LabPartnerDashboard from './features/lab-partner/pages/Dashboard'
import ManageTests from './features/lab-partner/pages/ManageTests'
import ManageBookings from './features/lab-partner/pages/ManageBookings'
import AdminLogin from './features/admin/pages/AdminLogin'
import AdminDashboard from './features/admin/pages/AdminDashboard'
import PendingApprovals from './features/admin/pages/PendingApprovals'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check user on mount
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user:', error);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Check for user changes every second
    const interval = setInterval(checkUser, 1000);

    return () => clearInterval(interval);
  }, []);

  const isFitnessEnthusiast = user && user.userType === 'fitness-enthusiast';
  

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
        <Route path="/trainer/upload-blog" element={<UploadBlog />} />
        
        {/* Lab Partner Dashboard (custom navbar, no footer) */}
        <Route path="/lab-partner/dashboard" element={<LabPartnerDashboard />} />
        <Route path="/lab-partner/manage-tests" element={<ManageTests />} />
        <Route path="/lab-partner/manage-bookings" element={<ManageBookings />} />

        {/* Fitness Enthusiast Dashboard (custom navbar with footer) */}
        <Route path="/fitness-enthusiast/dashboard" element={
          <>
            <FitnessEnthusiastNavbar userName={user?.name} />
            <FitnessEnthusiastDashboard />
            <Footer />
          </>
        } />

        {/* Fitness Enthusiast Care - My Lab Bookings */}
        <Route path="/fitness-enthusiast/care" element={
          <>
            <FitnessEnthusiastNavbar userName={user?.name} />
            <FitnessEnthusiastCare />
            <Footer />
          </>
        } />

        {/* Routes with Navbar and Footer */}
        <Route
          path="*"
          element={
            <>
              {isFitnessEnthusiast ? (
                <FitnessEnthusiastNavbar userName={user?.name} />
              ) : (
                <Navbar />
              )}
              <Routes>
                <Route path="/" element={
                  isFitnessEnthusiast ? (
                    <Navigate to="/fitness-enthusiast/dashboard" replace />
                  ) : (
                    <LandingPage />
                  )
                } />
                <Route path="/trainers" element={<Trainers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/fitness-enthusiast/read-blogs" element={<ReadBlogs />} />
                <Route path="/care" element={<Care />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/classes" element={<div className="min-h-screen bg-[#fffff0] py-20 text-center"><h1 className="text-4xl font-bold text-[#225533]">Classes - Coming Soon</h1></div>} />
                <Route path="/workouts" element={<div className="min-h-screen bg-[#fffff0] py-20 text-center"><h1 className="text-4xl font-bold text-[#225533]">Workouts - Coming Soon</h1></div>} />
                <Route path="/nutrition-plan" element={<div className="min-h-screen bg-[#fffff0] py-20 text-center"><h1 className="text-4xl font-bold text-[#225533]">Nutrition Plan - Coming Soon</h1></div>} />
                
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
