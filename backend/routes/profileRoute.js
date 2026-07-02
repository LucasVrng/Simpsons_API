import express from "express";
import { getProfile } from "../controllers/profileController.js";

const router = express.Router();

// Route GET : Quand on appelle /profile, on lance la fonction 'profile' du contrôleur
router.get("/", profile, authenticateToken, getProfile);

export default router;