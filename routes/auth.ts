import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signUp);
router.post("/login", signIn);

export default router;
