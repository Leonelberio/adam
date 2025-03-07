import express from "express";
import { getStats } from "../controllers/stats.controller";

const router = express.Router();

/**
 * GET /api/stats
 * Route to fetch statistics
 */
router.get("/", getStats);

export default router;
