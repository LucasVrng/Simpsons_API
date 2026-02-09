import db from "../config/db.js"; // Import de la connexion BDD
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validation : On vérifie que tout est rempli
        if (!username || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // 2. Vérification : On regarde si l'email existe déjà en base
        const existingUser = await db.get(
        "SELECT * FROM Users WHERE email = ?",
        [email],
        );

        if (existingUser) {
        return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const result = await db.run(
            "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword],
        );
        res.status(201).json({
      message: "Utilisateur inscrit avec succès",
      userId: result.insertId,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({
      message: "Error when registering"
    });
    }
}