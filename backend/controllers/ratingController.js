// controllers/ratingController.js
import db from "../config/db.js";

// POST /api/ratings/:type/:id — Créer ou mettre à jour une note
export const upsertRating = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 10 || !Number.isInteger(rating)) {
      return res.status(400).json({
        message: "La note doit être un entier entre 1 et 10"
      });
    }

    const existing = await db.get(
      "SELECT * FROM Ratings WHERE user_id = ? AND target_id = ? AND target_type = ?",
      [userId, id, type]
    );

    if (existing) {
      // Mise à jour de la note existante
      await db.run(
        `UPDATE Ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND target_id = ? AND target_type = ?`,
        [rating, userId, id, type]
      );
    } else {
      // Nouvelle note → on calcule la position automatiquement (dernière place)
      const { count } = await db.get(
        "SELECT COUNT(*) as count FROM Ratings WHERE user_id = ? AND target_type = ?",
        [userId, type]
      );

      const newPosition = count + 1;

      await db.run(
        `INSERT INTO Ratings (user_id, target_id, target_type, rating, rank_position)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, id, type, rating, newPosition]
      );
    }

    // On recalcule la moyenne globale pour renvoyer une réponse complète
    const { average, total } = await db.get(
      `SELECT ROUND(AVG(rating), 1) as average, COUNT(*) as total
       FROM Ratings WHERE target_id = ? AND target_type = ?`,
      [id, type]
    );

    res.json({
      userRating: rating,       // valeur brute /10
      stars: rating / 2,        // valeur affichée /5 (ex: 7 → 3.5 étoiles)
      average,                  // moyenne globale de tous les users
      total                     // nombre de notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la notation" });
  }
};

// DELETE /api/ratings/:type/:id — Supprimer sa note
export const deleteRating = async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user.id;

    const existing = await db.get(
      "SELECT * FROM Ratings WHERE user_id = ? AND target_id = ? AND target_type = ?",
      [userId, id, type]
    );

    if (!existing) {
      return res.status(404).json({ message: "Note introuvable" });
    }

    const deletedPosition = existing.rank_position;

    // Suppression de la note
    await db.run(
      "DELETE FROM Ratings WHERE user_id = ? AND target_id = ? AND target_type = ?",
      [userId, id, type]
    );

    // On comble le trou dans le classement
    // ex: si on supprime la position 3 sur 5 → les positions 4 et 5 deviennent 3 et 4
    await db.run(
      `UPDATE Ratings SET rank_position = rank_position - 1
       WHERE user_id = ? AND target_type = ? AND rank_position > ?`,
      [userId, type, deletedPosition]
    );

    res.json({ message: "Note supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

// GET /api/ratings/:type/:id — Infos sur un contenu
export const getRating = async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user.id;

    // Note personnelle de l'user
    const userRating = await db.get(
      "SELECT rating, rank_position FROM Ratings WHERE user_id = ? AND target_id = ? AND target_type = ?",
      [userId, id, type]
    );

    // Moyenne globale + total
    const { average, total } = await db.get(
      `SELECT ROUND(AVG(rating), 1) as average, COUNT(*) as total
       FROM Ratings WHERE target_id = ? AND target_type = ?`,
      [id, type]
    );

    res.json({
      userRating: userRating ? userRating.rating : null,
      stars: userRating ? userRating.rating / 2 : null,
      rankPosition: userRating ? userRating.rank_position : null,
      average,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
};