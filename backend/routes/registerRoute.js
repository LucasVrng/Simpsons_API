import express from "express";
import { register } from "../controllers/registerController.js";

const router = express.Router();

// Route POST : Quand on appelle /register, on lance la fonction 'register' du contrôleur
router.post("/", register);

export default router;