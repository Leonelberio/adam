import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  categorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * Get all categories
 * GET /api/categories
 */
router.get("/", authMiddleware, getCategories);

/**
 * Get category by ID
 * GET /api/categories/:id
 */
router.get("/:id", authMiddleware, getCategoryById);

/**
 * Create category
 * POST /api/categories
 */
router.post("/", authMiddleware, validate(categorySchema), createCategory);

/**
 * Update category
 * PUT /api/categories/:id
 */
router.put(
  "/:id",
  authMiddleware,
  validate(updateCategorySchema),
  updateCategory
);

/**
 * Delete category
 * DELETE /api/categories/:id
 */
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
