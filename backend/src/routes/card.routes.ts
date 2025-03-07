import express from "express";
import {
  getCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/card.controller";
import { validate } from "../middlewares/validation.middleware";
import { cardSchema, updateCardSchema } from "../schemas/card.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * Get all cards
 * GET /api/cards
 */
router.get("/", authMiddleware, getCards);

/**
 * Get card by ID
 * GET /api/cards/:id
 */
router.get("/:id", authMiddleware, getCardById);

/**
 * Create card
 * POST /api/cards
 */
router.post("/", authMiddleware, validate(cardSchema), createCard);

/**
 * Update card
 * PUT /api/cards/:id
 */
router.put("/:id", authMiddleware, validate(updateCardSchema), updateCard);

/**
 * Delete card
 * DELETE /api/cards/:id
 */
router.delete("/:id", authMiddleware, deleteCard);

export default router;
