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

// Dans ratingRoutes.js — ajoute ces deux routes
router.get("/ratings/:type", authenticateToken, validateType, async (req, res) => {
  try {
    const { type } = req.params;
    const ids = req.query.ids?.split(",").map(Number);
    if (!ids?.length) return res.json([]);

    const placeholders = ids.map(() => "?").join(",");
    const ratings = await db.all(
      `SELECT target_id, rating, rank_position FROM Ratings 
       WHERE user_id = ? AND target_type = ? AND target_id IN (${placeholders})`,
      [req.user.id, type, ...ids]
    );
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/likes/:type", authenticateToken, validateType, async (req, res) => {
  try {
    const { type } = req.params;
    const ids = req.query.ids?.split(",").map(Number);
    if (!ids?.length) return res.json([]);

    const placeholders = ids.map(() => "?").join(",");
    const likes = await db.all(
      `SELECT target_id FROM Likes 
       WHERE user_id = ? AND target_type = ? AND target_id IN (${placeholders})`,
      [req.user.id, type, ...ids]
    );
    res.json(likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});