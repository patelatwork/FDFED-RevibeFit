import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { USER_TYPES } from "../constants.js";

/**
 * @desc    Get all approved trainers
 * @route   GET /api/trainers
 * @access  Public
 */
export const getAllApprovedTrainers = asyncHandler(async (req, res) => {
  // Find all trainers who are approved and active
  const trainers = await User.find({
    userType: USER_TYPES.TRAINER,
    isApproved: true,
    isActive: true,
    approvalStatus: "approved",
  }).select("-password -refreshToken -__v");

  // If no trainers found
  if (!trainers || trainers.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, [], "No approved trainers found")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, trainers, "Approved trainers retrieved successfully")
  );
});

/**
 * @desc    Get single trainer by ID
 * @route   GET /api/trainers/:id
 * @access  Public
 */
export const getTrainerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const trainer = await User.findOne({
    _id: id,
    userType: USER_TYPES.TRAINER,
    isApproved: true,
    isActive: true,
    approvalStatus: "approved",
  }).select("-password -refreshToken -__v");

  if (!trainer) {
    throw new ApiError(404, "Trainer not found or not approved");
  }

  return res.status(200).json(
    new ApiResponse(200, trainer, "Trainer retrieved successfully")
  );
});
