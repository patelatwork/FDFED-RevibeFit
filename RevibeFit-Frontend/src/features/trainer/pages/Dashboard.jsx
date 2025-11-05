import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TrainerNavbar from '../components/TrainerNavbar';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [trainerName, setTrainerName] = useState('Trainer');

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      const userData = JSON.parse(user);
      setTrainerName(userData.name || 'Trainer');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fffff0]">
      <TrainerNavbar trainerName={trainerName} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#225533] mb-6">
          Trainer Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">My Clients</h2>
            <p className="text-gray-600">Manage your clients</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Schedule</h2>
            <p className="text-gray-600">View training sessions</p>
          </div>

          <Link to="/trainer/upload-blog" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Create & Manage Blogs</h2>
            <p className="text-gray-600">Share your knowledge</p>
          </Link>

          {/* More sections */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Live Classes</h2>
            <p className="text-gray-600">Host live classes</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Earnings</h2>
            <p className="text-gray-600">Track your earnings</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Profile</h2>
            <p className="text-gray-600">Manage your profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
