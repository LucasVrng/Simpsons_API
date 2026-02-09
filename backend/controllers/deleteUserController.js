import db from "../config/db.js";

// Supression d'un utilisateur par son ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // On récupère l'ID dans l'url (ex: /users/1)

    // Exécution de la requête SQL
    const [result] = await db.run("DELETE FROM Users WHERE id = ?", [id]);

    // Si aucune ligne n'a été affectée, c'est que l'utilisateur n'existait pas
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Utilisateur non trouvé." });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur Delete User: ", error);
    res.status(500).json({ message: "Erreur Serveur." });
  }
};