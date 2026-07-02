// controllers/rankingController.js
import db from "../config/db.js";

// GET /api/me/rankings/:type — Classement perso trié par position
export const getRankings = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user.id;

    const rankings = await db.all(
      `SELECT r.target_id, r.rating, r.rating / 2.0 as stars, r.rank_position, r.updated_at
       FROM Ratings r
       WHERE r.user_id = ? AND r.target_type = ?
       ORDER BY r.rank_position ASC`,
      [userId, type]
    );

    res.json(rankings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du classement" });
  }
};

// PATCH /api/me/rankings/:type — Réordonner manuellement
// body: { rankings: [{ target_id: 1, position: 1 }, { target_id: 2, position: 2 }, ...] }
export const reorderRankings = async (req, res) => {
  try {
    const { type } = req.params;
    const { rankings } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(rankings) || rankings.length === 0) {
      return res.status(400).json({ message: "Format invalide" });
    }

    // On vérifie que les positions sont valides (pas de doublons, pas de trous)
    const positions = rankings.map((r) => r.position).sort((a, b) => a - b);
    const isValid = positions.every((pos, i) => pos === i + 1);

    if (!isValid) {
      return res.status(400).json({
        message: "Les positions doivent être consécutives sans doublons (1, 2, 3...)"
      });
    }

    // Mise à jour de chaque position dans une transaction
    // pour éviter un état incohérent si une requête échoue
    await db.run("BEGIN TRANSACTION");

    try {
      for (const { target_id, position } of rankings) {
        await db.run(
          `UPDATE Ratings SET rank_position = ?
           WHERE user_id = ? AND target_id = ? AND target_type = ?`,
          [position, userId, target_id, type]
        );
      }
      await db.run("COMMIT");
    } catch (err) {
      await db.run("ROLLBACK");
      throw err;
    }

    res.json({ message: "Classement mis à jour" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors du réordonnancement" });
  }
};