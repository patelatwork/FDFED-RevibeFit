const FitnessEnthusiastDashboard = () => {
  return (
    <div className="min-h-screen bg-[#fffff0] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#225533] mb-6">
          Welcome to Your Fitness Dashboard
        </h1>
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
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Lab Tests</h2>
            <p className="text-gray-600">Book health tests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessEnthusiastDashboard;
