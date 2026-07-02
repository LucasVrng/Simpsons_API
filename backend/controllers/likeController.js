// controllers/likeController.js
import db from "../config/db.js";

// POST /api/likes/:type/:id — Toggle cœur (ajoute ou retire)
export const toggleLike = async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user.id;

    const existing = await db.get(
      "SELECT * FROM Likes WHERE user_id = ? AND target_id = ? AND target_type = ?",
      [userId, id, type]
    );

    if (existing) {
      await db.run(
        "DELETE FROM Likes WHERE user_id = ? AND target_id = ? AND target_type = ?",
        [userId, id, type]
      );
    } else {
      await db.run(
        "INSERT INTO Likes (user_id, target_id, target_type) VALUES (?, ?, ?)",
        [userId, id, type]
      );
    }

    const { total } = await db.get(
      "SELECT COUNT(*) as total FROM Likes WHERE target_id = ? AND target_type = ?",
      [id, type]
    );

    res.json({
      liked: !existing,  // true si on vient d'ajouter, false si on vient de retirer
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors du like" });
  }
};

// GET /api/likes/:type/:id — Statut cœur + total
export const getLike = async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user.id;

    const existing = await db.get(
      "SELECT * FROM Likes WHERE user_id = ? AND target_id = ? AND target_type = ?",
      [userId, id, type]
    );

    const { total } = await db.get(
      "SELECT COUNT(*) as total FROM Likes WHERE target_id = ? AND target_type = ?",
      [id, type]
    );

    res.json({ liked: !!existing, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
};