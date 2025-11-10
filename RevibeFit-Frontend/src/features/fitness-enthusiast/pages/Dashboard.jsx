import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FitnessEnthusiastDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('User');
  const [bookings, setBookings] = useState([]);
  const [readBlogs, setReadBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      const userData = JSON.parse(user);
      setUserName(userData.name || 'User');
      fetchBookings();
      fetchReadBlogs();
    }
  }, [navigate]);

  // Refresh blogs when the page gains focus (when user comes back from blog detail)
  useEffect(() => {
    const handleFocus = () => {
      fetchReadBlogs();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Also refresh blogs when returning to dashboard route
  useEffect(() => {
    if (location.pathname === '/fitness-enthusiast/dashboard') {
      fetchReadBlogs();
    }
  }, [location.pathname]);

  const fetchReadBlogs = async () => {
    try {
      setBlogsLoading(true);
      const token = localStorage.getItem('accessToken');
      console.log('Fetching read blogs...');
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/blogs/read-blogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Read blogs response status:', response.status);
      console.log('Read blogs response ok:', response.ok);
      
      const data = await response.json();
      console.log('Read blogs data:', data);
      
      if (data.success) {
        setReadBlogs(data.data.slice(0, 3)); // Show only last 3 for dashboard
        console.log('Read blogs set:', data.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching read blogs:', err);
    } finally {
      setBlogsLoading(false);
    }
  };

  const formatBlogDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab-partners/bookings/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        // Filter only pending and confirmed bookings
        const activeBookings = data.data.filter(
          booking => booking.status === 'pending' || booking.status === 'confirmed'
        );
        setBookings(activeBookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#fffff0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-[#225533] mb-6">
            Welcome to Your Fitness Dashboard
          </h1>
          
          {/* Lab Tests Section - Pending & Confirmed */}
          {loading ? (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3f8554]"></div>
                <span className="ml-3 text-gray-600">Loading lab tests...</span>
              </div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-[#3f8554]">
                  My Lab Tests
                </h2>
                <button
                  onClick={() => navigate('/fitness-enthusiast/care')}
                  className="text-[#3f8554] hover:text-[#225533] font-medium text-sm"
                >
                  View All Bookings →
                </button>
              </div>
              
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#3f8554] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#225533]">
                          {booking.labPartnerId?.laboratoryName || 'Lab Partner'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.labPartnerId?.laboratoryAddress}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-[#3f8554]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{formatDate(booking.bookingDate)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-[#3f8554]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{booking.timeSlot}</span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <h4 className="font-semibold text-[#225533] text-sm mb-2">Selected Tests:</h4>
                      <ul className="space-y-1">
                        {booking.selectedTests.map((test, index) => (
                          <li key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{test.testName}</span>
                            <span className="font-semibold text-[#3f8554]">₹{test.price}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-green-300 mt-2 pt-2 flex justify-between items-center">
                        <span className="font-bold text-[#225533] text-sm">Total:</span>
                        <span className="text-lg font-bold text-[#225533]">₹{booking.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-[#3f8554] mb-4">My Progress</h2>
              <p className="text-gray-600">Track your fitness journey</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Workouts</h2>
              <p className="text-gray-600">Browse personalized workouts</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Nutrition Plan</h2>
              <p className="text-gray-600">View your meal plans</p>
            </div>

            {/* More sections */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Live Classes</h2>
              <p className="text-gray-600">Join upcoming classes</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-[#3f8554] mb-4">My Trainer</h2>
              <p className="text-gray-600">Connect with your trainer</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#3f8554]">My Read Blogs</h2>
                <button
                  onClick={() => navigate('/fitness-enthusiast/read-blogs')}
                  className="text-[#3f8554] hover:text-[#225533] font-medium text-sm"
                >
                  View All →
                </button>
              </div>
              
              {blogsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3f8554]"></div>
                  <span className="ml-2 text-gray-600 text-sm">Loading...</span>
                </div>
              ) : readBlogs.length > 0 ? (
                <div className="space-y-3">
                  {readBlogs.map((blogReading) => (
                    <div
                      key={blogReading._id}
                      className="border border-gray-200 rounded-lg p-3 hover:border-[#3f8554] transition-colors cursor-pointer"
                      onClick={() => navigate(`/blog/${blogReading.blogId._id}`)}
                    >
                      <h3 className="font-semibold text-[#225533] text-sm mb-1 line-clamp-2">
                        {blogReading.blogId.title}
                      </h3>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          ✓ Completed
                        </span>
                        <span>Read on {formatBlogDate(blogReading.readAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-2">No blogs read yet</p>
                  <button
                    onClick={() => navigate('/blog')}
                    className="text-[#3f8554] hover:text-[#225533] font-medium text-sm"
                  >
                    Browse Blogs →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
  );
};

export default FitnessEnthusiastDashboard;
