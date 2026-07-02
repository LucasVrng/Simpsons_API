import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ref } from "process";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};  

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const user = await db.get(
      "SELECT * FROM Users WHERE username = ?",
      [username]
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET
    );
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.run("INSERT INTO RefreshTokens (user_id, token, expires_at) VALUES (?,?,?)",
      [user.id, refreshToken, expiresAt.toISOString()]);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "secure",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};
