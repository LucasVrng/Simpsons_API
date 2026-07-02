import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import deleteUserRoute from "./routes/deleteUserRoute.js";
import likeEpisodeRoute from "./routes/likeEpisodeRoute.js";
import profileRoute from "./routes/profileRoute.js";
import ratingRoutes from "./routes/ratingRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(session({
  secret: env.ACCESS_TOKEN_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(cookieParser());

// si ton frontend est sur un domaine/port différent (ex: localhost:5173)
// app.use(cors({
//   origin: "http://localhost:5173", // l'URL de ton frontend
//   credentials: true // indispensable pour que les cookies soient envoyés/reçus
// }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/users", deleteUserRoute);
app.use("/episodes", likeEpisodeRoute);
app.use("/api", ratingRoutes);

const posts = [
  {
    username: "Homer",
    title: "shar sucks"
  },
  {
    username: "Marge",
    title: "life sucks"
  }
];

const users = [];

function authToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.get("/posts", authToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.username));
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});