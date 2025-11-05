import { Router } from "express";
import {
  getAllApprovedTrainers,
  getTrainerById,
} from "../controllers/trainer.controller.js";

const router = Router();

// Public routes
router.route("/").get(getAllApprovedTrainers);
router.route("/:id").get(getTrainerById);

export default router;
