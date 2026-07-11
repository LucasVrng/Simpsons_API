import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token manquant" });
    }

    const stored = await db.get(
      "SELECT * FROM RefreshTokens WHERE token = ?",
      [refreshToken]
    );

    if (!stored) {
      return res.status(403).json({ message: "Refresh token invalide ou révoqué" });
    }

    if (new Date(stored.expires_at) < new Date()) {
      await db.run("DELETE FROM RefreshTokens WHERE token = ?", [refreshToken]);
      return res.status(403).json({ message: "Refresh token expiré" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Refresh token invalide" });

      const user = await db.get("SELECT * FROM Users WHERE id = ?", [decoded.id]);
      if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors du refresh" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await db.run("DELETE FROM RefreshTokens WHERE token = ?", [refreshToken]);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    res.json({ message: "Déconnecté avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la déconnexion" });
  }
};