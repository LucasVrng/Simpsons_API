import db from "../config/db.js";

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({message: "Refresh token manquant"})
        }

        const stored = await db.get("SELECT * FROM RefreshTokens WHERE token = ?",
            [refreshToken]
        );

        if (!stored) {
            return res.status(403).json({message: "Refresh token invalide"})
        }

        if (new Date(stored.expires_at) < new Date()) {
            await db.run("DELETE FROM RefreshTokens WHERE token = ?", [refreshToken]);
            return res.status(403).json({message: "Refresh token expiré"});
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Refresh token invalide"});
            }

            const user = await db.get("SELECT * FROM Users WHERE id = ?", [decoded.id]);
            if (!user) {
                return res.status(403).json({message: "User not found"});
            }

            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken});
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error when trying to refresh"})
    }
}