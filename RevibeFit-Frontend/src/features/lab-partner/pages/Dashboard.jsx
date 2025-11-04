import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LabPartnerNavbar from '../components/LabPartnerNavbar';

const LabPartnerDashboard = () => {
  const navigate = useNavigate();
  const [labName, setLabName] = useState('Lab Partner');

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      const userData = JSON.parse(user);
      setLabName(userData.laboratoryName || userData.name || 'Lab Partner');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fffff0]">
      <LabPartnerNavbar labName={labName} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#225533] mb-6">
          Lab Partner Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Test Bookings</h2>
            <p className="text-gray-600">View booking requests</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Schedule</h2>
            <p className="text-gray-600">Manage appointments</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Reports</h2>
            <p className="text-gray-600">Upload test reports</p>
          </div>

          {/* More sections */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Lab Services</h2>
            <p className="text-gray-600">Manage available tests</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Revenue</h2>
            <p className="text-gray-600">Track your earnings</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Lab Profile</h2>
            <p className="text-gray-600">Update lab information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPartnerDashboard;
