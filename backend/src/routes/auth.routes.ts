import express from "express";
import { validate } from "../middlewares/validation.middleware";
import { signUpSchema, signInSchema } from "../schemas/auth.schema";
import { logout, signIn, signUp } from "../controllers/auth.controller";

const router = express.Router();

router.post("/email/sign-up", validate(signUpSchema), signUp);
router.post("/email/sign-in", validate(signInSchema), signIn);
router.post("/logout", logout);

export default router;
