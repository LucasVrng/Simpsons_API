import db from "../config/db.js";

export const getProfile = async (req, res) => {
    try {
        const user = await db.get(
            "SELECT id, username, email FROM users WHERE id = ?"
            [req.user.id]
        );

        if (!user) {
            return res.status(404).json({message: "Utilisateur introuvable"});
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Erreur serveur"})
    }
}