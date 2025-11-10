import { Router } from "express";
import { 
  adminLogin, 
  getPendingApprovals, 
  approveUser, 
  rejectUser, 
  getUserStats,
  getMonthlyGrowth,
  getUserDistribution,
  getAllUsers,
  toggleUserSuspension
} from "../controllers/admin.controller.js";

const router = Router();

// Admin login route
router.post("/login", adminLogin);

// Get pending approval requests
router.get("/pending-approvals", getPendingApprovals);

// Approve user
router.post("/approve/:userId", approveUser);

// Reject user
router.post("/reject/:userId", rejectUser);

// Get user statistics
router.get("/stats", getUserStats);

// Analytics routes
router.get("/analytics/monthly-growth", getMonthlyGrowth);
router.get("/analytics/user-distribution", getUserDistribution);

// User management routes
router.get("/users", getAllUsers);
router.patch("/users/:userId/suspend", toggleUserSuspension);

export default router;
