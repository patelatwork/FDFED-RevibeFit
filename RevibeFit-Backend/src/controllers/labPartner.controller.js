import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { STATUS_CODES, USER_TYPES } from "../constants.js";
import { User } from "../models/user.model.js";
import { LabTest } from "../models/labTest.model.js";
import { LabBooking } from "../models/labBooking.model.js";

// @desc    Get all approved lab partners
// @route   GET /api/lab-partners
// @access  Public (mainly for fitness enthusiasts)
const getApprovedLabPartners = asyncHandler(async (req, res) => {
  const { search } = req.query;

  let query = {
    userType: USER_TYPES.LAB_PARTNER,
    isApproved: true,
    approvalStatus: "approved",
    isActive: true,
  };

  // Add search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { laboratoryName: { $regex: search, $options: "i" } },
      { laboratoryAddress: { $regex: search, $options: "i" } },
    ];
  }

  const labPartners = await User.find(query).select(
    "-password -refreshToken"
  );

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        labPartners,
        "Lab partners fetched successfully"
      )
    );
});

// @desc    Get a specific lab partner by ID
// @route   GET /api/lab-partners/:id
// @access  Public
const getLabPartnerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const labPartner = await User.findOne({
    _id: id,
    userType: USER_TYPES.LAB_PARTNER,
    isApproved: true,
    approvalStatus: "approved",
  }).select("-password -refreshToken");

  if (!labPartner) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Lab partner not found");
  }

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        labPartner,
        "Lab partner fetched successfully"
      )
    );
});

// @desc    Add a new lab test (Lab Partner only)
// @route   POST /api/lab-partners/tests
// @access  Private (Lab Partner)
const addLabTest = asyncHandler(async (req, res) => {
  const {
    testName,
    description,
    price,
    duration,
    category,
    preparationInstructions,
  } = req.body;

  // Validate required fields
  if (!testName || !description || !price || !duration) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Test name, description, price, and duration are required"
    );
  }

  // Get lab partner ID from authenticated user
  const labPartnerId = req.user._id;

  // Verify the user is a lab partner
  const labPartner = await User.findOne({
    _id: labPartnerId,
    userType: USER_TYPES.LAB_PARTNER,
  });

  if (!labPartner) {
    throw new ApiError(
      STATUS_CODES.FORBIDDEN,
      "Only lab partners can add tests"
    );
  }

  const labTest = await LabTest.create({
    testName,
    description,
    price,
    duration,
    labPartnerId,
    category: category || "Other",
    preparationInstructions: preparationInstructions || "No special preparation required",
  });

  return res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(STATUS_CODES.CREATED, labTest, "Lab test added successfully")
    );
});

// @desc    Get all tests for a specific lab partner
// @route   GET /api/lab-partners/:id/tests
// @access  Public
const getLabTestsByPartnerId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // First, get the lab partner to check their offered tests
  const labPartner = await User.findById(id);
  if (!labPartner) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Lab partner not found");
  }

  // Get all active tests for this lab partner
  const allTests = await LabTest.find({
    labPartnerId: id,
    isActive: true,
  }).populate("labPartnerId", "name laboratoryName");

  // Filter to only show tests that are in the offeredTests array
  // If offeredTests is empty or undefined, show no tests
  const offeredTestIds = labPartner.offeredTests || [];
  const offeredTests = allTests.filter((test) =>
    offeredTestIds.some((offeredId) => offeredId.toString() === test._id.toString())
  );

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        offeredTests,
        "Lab tests fetched successfully"
      )
    );
});

// @desc    Get all tests for the authenticated lab partner
// @route   GET /api/lab-partners/my-tests
// @access  Private (Lab Partner)
const getMyLabTests = asyncHandler(async (req, res) => {
  const labPartnerId = req.user._id;

  const tests = await LabTest.find({
    labPartnerId,
  }).sort({ createdAt: -1 });

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        tests,
        "Your lab tests fetched successfully"
      )
    );
});

// @desc    Update a lab test
// @route   PUT /api/lab-partners/tests/:testId
// @access  Private (Lab Partner)
const updateLabTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const labPartnerId = req.user._id;

  const test = await LabTest.findOne({
    _id: testId,
    labPartnerId,
  });

  if (!test) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      "Test not found or you don't have permission to update it"
    );
  }

  // Update fields
  const allowedUpdates = [
    "testName",
    "description",
    "price",
    "duration",
    "category",
    "preparationInstructions",
    "isActive",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      test[field] = req.body[field];
    }
  });

  await test.save();

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(STATUS_CODES.SUCCESS, test, "Lab test updated successfully")
    );
});

// @desc    Delete a lab test
// @route   DELETE /api/lab-partners/tests/:testId
// @access  Private (Lab Partner)
const deleteLabTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const labPartnerId = req.user._id;

  const test = await LabTest.findOneAndDelete({
    _id: testId,
    labPartnerId,
  });

  if (!test) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      "Test not found or you don't have permission to delete it"
    );
  }

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(STATUS_CODES.SUCCESS, {}, "Lab test deleted successfully")
    );
});

// @desc    Create a new booking
// @route   POST /api/lab-partners/bookings
// @access  Private (Fitness Enthusiast)
const createBooking = asyncHandler(async (req, res) => {
  const {
    labPartnerId,
    selectedTests,
    bookingDate,
    timeSlot,
    notes,
  } = req.body;

  // Validate required fields
  if (!labPartnerId || !selectedTests || selectedTests.length === 0 || !bookingDate || !timeSlot) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Lab partner, tests, booking date, and time slot are required"
    );
  }

  const fitnessEnthusiastId = req.user._id;

  // Verify lab partner exists and is approved
  const labPartner = await User.findOne({
    _id: labPartnerId,
    userType: USER_TYPES.LAB_PARTNER,
    isApproved: true,
  });

  if (!labPartner) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Lab partner not found or not approved");
  }

  // Verify all tests exist and calculate total
  let totalAmount = 0;
  const testDetails = [];

  for (const testItem of selectedTests) {
    const test = await LabTest.findById(testItem.testId);
    if (!test) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, `Test with ID ${testItem.testId} not found`);
    }
    totalAmount += test.price;
    testDetails.push({
      testId: test._id,
      testName: test.testName,
      price: test.price,
    });
  }

  // Create booking
  const booking = await LabBooking.create({
    fitnessEnthusiastId,
    labPartnerId,
    selectedTests: testDetails,
    bookingDate: new Date(bookingDate),
    timeSlot,
    totalAmount,
    notes: notes || "",
    contactPhone: req.user.phone,
    contactEmail: req.user.email,
    status: "pending",
    paymentStatus: "pending",
  });

  // Populate the booking with user and test details
  const populatedBooking = await LabBooking.findById(booking._id)
    .populate("fitnessEnthusiastId", "name email phone")
    .populate("labPartnerId", "name laboratoryName laboratoryAddress phone email")
    .populate("selectedTests.testId", "testName description duration");

  return res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(
        STATUS_CODES.CREATED,
        populatedBooking,
        "Booking created successfully"
      )
    );
});

// @desc    Get bookings for fitness enthusiast
// @route   GET /api/lab-partners/my-bookings
// @access  Private (Fitness Enthusiast)
const getMyBookings = asyncHandler(async (req, res) => {
  const fitnessEnthusiastId = req.user._id;

  const bookings = await LabBooking.find({ fitnessEnthusiastId })
    .populate("labPartnerId", "name laboratoryName laboratoryAddress phone email")
    .populate("selectedTests.testId", "testName description duration")
    .sort({ createdAt: -1 });

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        bookings,
        "Your bookings fetched successfully"
      )
    );
});

// @desc    Get bookings for lab partner
// @route   GET /api/lab-partners/lab-bookings
// @access  Private (Lab Partner)
const getLabBookings = asyncHandler(async (req, res) => {
  const labPartnerId = req.user._id;

  const bookings = await LabBooking.find({ labPartnerId })
    .populate("fitnessEnthusiastId", "name email phone age")
    .populate("selectedTests.testId", "testName description duration")
    .sort({ createdAt: -1 }); // Sort by creation date - latest first (day-wise), with first-come first-served within each day

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        bookings,
        "Lab bookings fetched successfully"
      )
    );
});

// @desc    Update booking status (Lab Partner)
// @route   PUT /api/lab-partners/bookings/:bookingId/status
// @access  Private (Lab Partner)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status, expectedReportDeliveryTime } = req.body;
  const labPartnerId = req.user._id;

  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid status");
  }

  const booking = await LabBooking.findOne({
    _id: bookingId,
    labPartnerId,
  });

  if (!booking) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      "Booking not found or you don't have permission"
    );
  }

  booking.status = status;
  
  // Update expected report delivery time if provided
  if (expectedReportDeliveryTime !== undefined) {
    booking.expectedReportDeliveryTime = expectedReportDeliveryTime;
  }
  
  await booking.save();

  const populatedBooking = await LabBooking.findById(booking._id)
    .populate("fitnessEnthusiastId", "name email phone")
    .populate("labPartnerId", "name laboratoryName")
    .populate("selectedTests.testId", "testName");

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        populatedBooking,
        "Booking status updated successfully"
      )
    );
});

// @desc    Cancel a booking (Fitness Enthusiast)
// @route   PUT /api/lab-partners/bookings/:bookingId/cancel
// @access  Private (Fitness Enthusiast)
const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const fitnessEnthusiastId = req.user._id;

  const booking = await LabBooking.findOne({
    _id: bookingId,
    fitnessEnthusiastId,
  });

  if (!booking) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      "Booking not found"
    );
  }

  if (booking.status === "completed") {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Cannot cancel a completed booking"
    );
  }

  booking.status = "cancelled";
  await booking.save();

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        booking,
        "Booking cancelled successfully"
      )
    );
});

// @desc    Get offered tests for authenticated lab partner
// @route   GET /api/lab-partners/offered-tests
// @access  Private (Lab Partner)
const getOfferedTests = asyncHandler(async (req, res) => {
  const labPartnerId = req.user._id;

  const labPartner = await User.findById(labPartnerId).populate({
    path: "offeredTests",
    select: "testName description price duration category preparationInstructions isActive",
    match: { isActive: true }, // Only populate active tests
  });

  if (!labPartner) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Lab partner not found");
  }

  // Filter out null values (tests that were deleted)
  const validOfferedTests = (labPartner.offeredTests || []).filter(test => test !== null);

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        validOfferedTests,
        "Offered tests fetched successfully"
      )
    );
});

// @desc    Update offered tests for authenticated lab partner
// @route   PUT /api/lab-partners/offered-tests
// @access  Private (Lab Partner)
const updateOfferedTests = asyncHandler(async (req, res) => {
  const labPartnerId = req.user._id;
  const { testIds } = req.body;

  if (!Array.isArray(testIds)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "testIds must be an array"
    );
  }

  // Verify all test IDs belong to this lab partner
  const tests = await LabTest.find({
    _id: { $in: testIds },
    labPartnerId,
  });

  if (tests.length !== testIds.length) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Some tests do not belong to this lab partner or do not exist"
    );
  }

  // Update the lab partner's offered tests
  const labPartner = await User.findByIdAndUpdate(
    labPartnerId,
    { offeredTests: testIds },
    { new: true }
  ).populate({
    path: "offeredTests",
    select: "testName description price duration category preparationInstructions isActive",
  });

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        labPartner.offeredTests,
        "Offered tests updated successfully"
      )
    );
});

export {
  getApprovedLabPartners,
  getLabPartnerById,
  addLabTest,
  getLabTestsByPartnerId,
  getMyLabTests,
  updateLabTest,
  deleteLabTest,
  createBooking,
  getMyBookings,
  getLabBookings,
  updateBookingStatus,
  cancelBooking,
  getOfferedTests,
  updateOfferedTests,
};
