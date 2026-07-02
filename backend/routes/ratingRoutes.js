// routes/ratingRoutes.js
import express from "express";
import { upsertRating, deleteRating, getRating } from "../controllers/ratingController.js";
import { toggleLike, getLike } from "../controllers/likeController.js";
import { getRankings, reorderRankings } from "../controllers/rankingController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateType } from "../middleware/validateType.js";

const router = express.Router();

// Toutes ces routes nécessitent d'être connecté
router.use(authenticateToken);

// Notes
router.post("/ratings/:type/:id",   validateType, upsertRating);
router.delete("/ratings/:type/:id", validateType, deleteRating);
router.get("/ratings/:type/:id",    validateType, getRating);

// Cœurs
router.post("/likes/:type/:id", validateType, toggleLike);
router.get("/likes/:type/:id",  validateType, getLike);

// Classement perso
router.get("/me/rankings/:type",   validateType, getRankings);
router.patch("/me/rankings/:type", validateType, reorderRankings);

export default router;