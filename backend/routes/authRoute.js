import express from "express";
import { refresh, logout } from "../controllers/loginController.js";

const router = express.Router();

router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;