import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { STATUS_CODES, USER_TYPES } from "../constants.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// Admin credentials 
const ADMIN_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "Admin@123",
  name: "RevibeFit Admin",
  userType: USER_TYPES.ADMIN
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Email and password are required"
    );
  }

  // Check credentials
  if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid admin credentials");
  }

  // Create admin session data (without sensitive info)
  const adminData = {
    email: ADMIN_CREDENTIALS.email,
    name: ADMIN_CREDENTIALS.name,
    userType: ADMIN_CREDENTIALS.userType,
    isAdmin: true
  };

  // In a real app, you'd generate JWT tokens here
  // For now, we'll just return the admin data
  
  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        {
          admin: adminData,
          // You can add JWT tokens here later
        },
        "Admin logged in successfully"
      )
    );
});

// @desc    Get pending approval requests
// @route   GET /api/admin/pending-approvals
// @access  Admin
const getPendingApprovals = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({
    approvalStatus: "pending",
    userType: { $in: [USER_TYPES.TRAINER, USER_TYPES.LAB_PARTNER] }
  }).select("-password -refreshToken");

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        pendingUsers,
        "Pending approvals fetched successfully"
      )
    );
});

// @desc    Approve user
// @route   POST /api/admin/approve/:userId
// @access  Admin
const approveUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const adminEmail = ADMIN_CREDENTIALS.email; // In real app, get from authenticated admin

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found");
  }

  if (user.approvalStatus === "approved") {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "User is already approved");
  }

  user.approvalStatus = "approved";
  user.isApproved = true;
  user.approvedBy = adminEmail;
  user.approvedAt = new Date();
  await user.save();

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        user,
        "User approved successfully"
      )
    );
});

// @desc    Reject user
// @route   POST /api/admin/reject/:userId
// @access  Admin
const rejectUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found");
  }

  user.approvalStatus = "rejected";
  user.isApproved = false;
  await user.save();

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        user,
        "User rejected successfully"
      )
    );
});

// @desc    Get all users statistics
// @route   GET /api/admin/stats
// @access  Admin
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const fitnessEnthusiasts = await User.countDocuments({ userType: USER_TYPES.FITNESS_ENTHUSIAST });
  const trainers = await User.countDocuments({ userType: USER_TYPES.TRAINER });
  const labPartners = await User.countDocuments({ userType: USER_TYPES.LAB_PARTNER });
  const pendingApprovals = await User.countDocuments({ approvalStatus: "pending" });

  const stats = {
    totalUsers,
    fitnessEnthusiasts,
    trainers,
    labPartners,
    pendingApprovals
  };

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        stats,
        "User statistics fetched successfully"
      )
    );
});

// @desc    Get monthly user growth analytics
// @route   GET /api/admin/analytics/monthly-growth
// @access  Admin
const getMonthlyGrowth = asyncHandler(async (req, res) => {
  // Get current date and date 12 months ago
  const now = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(now.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  // Aggregate users by month
  const monthlyData = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 },
        fitnessEnthusiasts: {
          $sum: { $cond: [{ $eq: ["$userType", USER_TYPES.FITNESS_ENTHUSIAST] }, 1, 0] }
        },
        trainers: {
          $sum: { $cond: [{ $eq: ["$userType", USER_TYPES.TRAINER] }, 1, 0] }
        },
        labPartners: {
          $sum: { $cond: [{ $eq: ["$userType", USER_TYPES.LAB_PARTNER] }, 1, 0] }
        }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  // Format data for charts
  const formattedData = monthlyData.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    total: item.count,
    fitnessEnthusiasts: item.fitnessEnthusiasts,
    trainers: item.trainers,
    labPartners: item.labPartners
  }));

  return res.status(STATUS_CODES.SUCCESS).json(
    new ApiResponse(STATUS_CODES.SUCCESS, formattedData, "Monthly growth data retrieved successfully")
  );
});

// @desc    Get user type distribution for pie chart
// @route   GET /api/admin/analytics/user-distribution
// @access  Admin
const getUserDistribution = asyncHandler(async (req, res) => {
  const distribution = await User.aggregate([
    {
      $group: {
        _id: "$userType",
        count: { $sum: 1 }
      }
    }
  ]);

  // Format for pie chart
  const formattedData = distribution.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1).replace('-', ' '),
    value: item.count,
    type: item._id
  }));

  return res.status(STATUS_CODES.SUCCESS).json(
    new ApiResponse(STATUS_CODES.SUCCESS, formattedData, "User distribution data retrieved successfully")
  );
});

// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const userType = req.query.userType || '';

  // Build filter query
  let filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (userType) {
    filter.userType = userType;
  }

  const users = await User.find(filter)
    .select('-password -refreshToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(STATUS_CODES.SUCCESS).json(
    new ApiResponse(STATUS_CODES.SUCCESS, {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, "Users retrieved successfully")
  );
});

// @desc    Suspend/Unsuspend user account
// @route   PATCH /api/admin/users/:userId/suspend
// @access  Admin
const toggleUserSuspension = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { suspend, reason } = req.body;

  if (typeof suspend !== 'boolean') {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Suspend field must be a boolean");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found");
  }

  // Prevent suspending admin users (if they exist in DB)
  if (user.userType === USER_TYPES.ADMIN) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Cannot suspend admin accounts");
  }

  user.isSuspended = suspend;
  user.suspensionReason = suspend ? (reason || 'No reason provided') : null;
  user.suspendedAt = suspend ? new Date() : null;
  
  await user.save();

  return res.status(STATUS_CODES.SUCCESS).json(
    new ApiResponse(STATUS_CODES.SUCCESS, {
      userId: user._id,
      isSuspended: user.isSuspended,
      reason: user.suspensionReason
    }, `User ${suspend ? 'suspended' : 'unsuspended'} successfully`)
  );
});

export { 
  adminLogin, 
  getPendingApprovals, 
  approveUser, 
  rejectUser, 
  getUserStats,
  getMonthlyGrowth,
  getUserDistribution,
  getAllUsers,
  toggleUserSuspension
};
