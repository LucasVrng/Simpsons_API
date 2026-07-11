import dotenv from "dotenv";
dotenv.config();

import express from "express";
import jwt from "jsonwebtoken";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import deleteUserRoute from "./routes/deleteUserRoute.js";
import profileRoute from "./routes/profileRoute.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import authRoute from "./routes/authRoute.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/users", deleteUserRoute);
app.use("/profile", profileRoute);
app.use("/api", authRoute);
app.use("/api", ratingRoutes);

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});