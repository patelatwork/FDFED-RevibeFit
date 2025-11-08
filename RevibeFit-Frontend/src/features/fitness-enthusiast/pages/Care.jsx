import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LabPartnerCard from '../components/LabPartnerCard';
import LabBookingModal from '../components/LabBookingModal';

const Care = () => {
  const navigate = useNavigate();
  const [labPartners, setLabPartners] = useState([]);
  const [filteredLabPartners, setFilteredLabPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLabPartner, setSelectedLabPartner] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    fetchLabPartners();
  }, [navigate]);

  const fetchLabPartners = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/lab-partners`
      );
      const data = await response.json();

      if (data.success) {
        setLabPartners(data.data);
        setFilteredLabPartners(data.data);
      } else {
        setError('Failed to load lab partners');
      }
    } catch (err) {
      console.error('Error fetching lab partners:', err);
      setError('Failed to load lab partners. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLabPartners(labPartners);
    } else {
      const filtered = labPartners.filter(
        (lab) =>
          lab.laboratoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.laboratoryAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLabPartners(filtered);
    }
  }, [searchTerm, labPartners]);

  const handleViewDetails = (labPartner) => {
    setSelectedLabPartner(labPartner);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedLabPartner(null);
  };

  const handleBookingSuccess = (booking) => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffff0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3f8554] mx-auto mb-4"></div>
          <p className="text-xl text-[#225533] font-semibold">Loading lab partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffff0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#225533] mb-4">Lab Partner Care</h1>
          <p className="text-lg text-gray-600">
            Find trusted lab partners for your health and fitness testing needs
          </p>
        </div>

        {/* Success Message */}
        {bookingSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">
              Booking successful! We'll contact you soon to confirm your appointment.
            </span>
          </div>
        )}

        {/* Info Section - How It Works */}
        <div className="mb-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#225533] mb-4">
            How Lab Partner Care Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3f8554] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-semibold text-[#225533] mb-2">Browse Lab Partners</h3>
              <p className="text-gray-600 text-sm">
                Search and explore approved lab partners in your area
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3f8554] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-semibold text-[#225533] mb-2">Select Tests</h3>
              <p className="text-gray-600 text-sm">
                Choose from available tests and pick a convenient time slot
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3f8554] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-semibold text-[#225533] mb-2">Get Tested</h3>
              <p className="text-gray-600 text-sm">
                Visit the lab at your scheduled time and get your tests done
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search by lab name, location, or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pr-12 text-lg border-2 border-[#3f8554] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#225533] focus:border-transparent"
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#3f8554]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredLabPartners.length} lab partner(s)
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Lab Partners Grid */}
        {filteredLabPartners.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-500 mb-2">
              {searchTerm ? 'No lab partners found' : 'No lab partners available'}
            </h3>
            <p className="text-gray-400">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Check back later for approved lab partners'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabPartners.map((labPartner) => (
              <LabPartnerCard
                key={labPartner._id}
                labPartner={labPartner}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedLabPartner && (
        <LabBookingModal
          labPartner={selectedLabPartner}
          onClose={handleCloseModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Care;
