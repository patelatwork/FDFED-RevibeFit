import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getTrainerBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { verifyJWT, verifyUserType } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/multer.middleware.js";
import { USER_TYPES } from "../constants.js";

const router = Router();

// Public routes
router.route("/").get(getAllBlogs);
router.route("/:id").get(getBlogById);

// Protected routes - Trainer only
router.route("/").post(
  verifyJWT,
  verifyUserType(USER_TYPES.TRAINER),
  uploadImage.single("thumbnail"),
  createBlog
);

router.route("/trainer/my-blogs").get(
  verifyJWT,
  verifyUserType(USER_TYPES.TRAINER),
  getTrainerBlogs
);

router.route("/:id").put(
  verifyJWT,
  verifyUserType(USER_TYPES.TRAINER),
  uploadImage.single("thumbnail"),
  updateBlog
);

router.route("/:id").delete(
  verifyJWT,
  verifyUserType(USER_TYPES.TRAINER),
  deleteBlog
);

export default router;
