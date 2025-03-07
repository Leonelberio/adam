import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validation.middleware";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * Get all users
 * GET /api/users
 */
router.get("/", authMiddleware, getUsers);

/**
 * Get user by ID
 * GET /api/users/:id
 */
router.get("/:id", authMiddleware, getUserById);

/**
 * Create user
 * POST /api/users
 */
router.post("/", authMiddleware, validate(createUserSchema), createUser);

/**
 * Update user
 * PUT /api/users/:id
 */
router.put("/:id", authMiddleware, validate(updateUserSchema), updateUser);

/**
 * Delete user
 * DELETE /api/users/:id
 */
router.delete("/:id", authMiddleware, deleteUser);

export default router;
