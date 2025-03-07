import express from "express";
import {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../controllers/country.controller";
import { validate } from "../middlewares/validation.middleware";
import { countrySchema, updateCountrySchema } from "../schemas/country.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * Get all countries
 * GET /api/countries
 */
router.get("/", authMiddleware, getCountries);

/**
 * Get country by ID
 * GET /api/countries/:id
 */
router.get("/:id", authMiddleware, getCountryById);

/**
 * Create country
 * POST /api/countries
 */
router.post("/", authMiddleware, validate(countrySchema), createCountry);

/**
 * Update country
 * PUT /api/countries/:id
 */
router.put(
  "/:id",
  authMiddleware,
  validate(updateCountrySchema),
  updateCountry
);

/**
 * Delete country
 * DELETE /api/countries/:id
 */
router.delete("/:id", authMiddleware, deleteCountry);

export default router;
