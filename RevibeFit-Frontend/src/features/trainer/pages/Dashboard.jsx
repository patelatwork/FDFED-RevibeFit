const TrainerDashboard = () => {
  return (
    <div className="min-h-screen bg-[#fffff0] p-8">
      <div className="max-w-7xl mx-auto">
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

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#3f8554] mb-4">Content</h2>
            <p className="text-gray-600">Create workout content</p>
          </div>

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
