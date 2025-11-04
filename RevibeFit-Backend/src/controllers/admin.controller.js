import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { STATUS_CODES, USER_TYPES } from "../constants.js";
import { User } from "../models/user.model.js";

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

export { adminLogin, getPendingApprovals, approveUser, rejectUser, getUserStats };
