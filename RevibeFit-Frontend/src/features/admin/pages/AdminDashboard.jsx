import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import useLiveData from '../../../hooks/useLiveData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    fitnessEnthusiasts: 0,
    trainers: 0,
    labPartners: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use live data hook for auto-refresh every 5 seconds
  useLiveData(fetchStats, 5000);

  return (
    <div className="min-h-screen bg-[#fffff0]">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#225533] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome to RevibeFit Admin Panel</p>
            </div>
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live Updates</span>
            </div>
          </div>
        </div>

        {/* Pending Approvals Alert */}
        {!loading && stats.pendingApprovals > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-800">
                  <span className="font-semibold">{stats.pendingApprovals}</span> registration{stats.pendingApprovals !== 1 ? 's' : ''} pending your approval
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/pending-approvals')}
                className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 font-medium transition-colors"
              >
                Review Now
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-[#225533] mt-2">
                  {loading ? '...' : stats.totalUsers}
                </p>
              </div>
              <div className="bg-[#3f8554] bg-opacity-10 p-3 rounded-full">
                <svg className="w-8 h-8 text-[#3f8554]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Fitness Enthusiasts</p>
                <p className="text-3xl font-bold text-[#225533] mt-2">
                  {loading ? '...' : stats.fitnessEnthusiasts}
                </p>
              </div>
              <div className="bg-blue-500 bg-opacity-10 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Trainers</p>
                <p className="text-3xl font-bold text-[#225533] mt-2">
                  {loading ? '...' : stats.trainers}
                </p>
              </div>
              <div className="bg-orange-500 bg-opacity-10 p-3 rounded-full">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Lab Partners</p>
                <p className="text-3xl font-bold text-[#225533] mt-2">
                  {loading ? '...' : stats.labPartners}
                </p>
              </div>
              <div className="bg-purple-500 bg-opacity-10 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-[#225533] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/admin/pending-approvals')}
              className="p-4 border-2 border-[#3f8554] rounded-lg hover:bg-[#3f8554] hover:text-white transition-all duration-200 text-left group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-white">Manage Approvals</h3>
              <p className="text-sm text-gray-600 group-hover:text-white">Review pending trainer and lab partner registrations</p>
            </button>

            <button className="p-4 border-2 border-[#3f8554] rounded-lg hover:bg-[#3f8554] hover:text-white transition-all duration-200 text-left group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-white">View Reports</h3>
              <p className="text-sm text-gray-600 group-hover:text-white">Access detailed analytics and reports</p>
            </button>

            <button className="p-4 border-2 border-[#3f8554] rounded-lg hover:bg-[#3f8554] hover:text-white transition-all duration-200 text-left group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-white">System Settings</h3>
              <p className="text-sm text-gray-600 group-hover:text-white">Configure system preferences</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
