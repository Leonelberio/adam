import express from "express";
import { getVisitors, postVisitor } from "../controllers/visitors.controller";

const router = express.Router();

/**
 * GET /api/visitors
 * Route to fetch the count of active visitors in the last 5 minutes
 */
router.get("/", getVisitors);

/**
 * POST /api/visitors
 * Route to record or update a visitor's session
 */
router.post("/", postVisitor);

export default router;
