import dotenv from "dotenv";
import express from "express";

dotenv.config();
import jwt from "jsonwebtoken"
const app = express();

import loginRoutes from "./routes/loginRoute.js";
import registerRoutes from "./routes/registerRoute.js";
import deleteUserRoutes from "./routes/deleteUserRoute.js";
import likeEpisodeRoutes from "./routes/likeEpisodeRoute.js";

app.use(express.json());
app.use(express.static("public"));


// const users = []

// app.get("/users", (req,res) => {
//   res.json(users)
// })

app.use("/users/register", registerRoutes)

app.use("/users/login", loginRoutes)

app.use("/users/deleteUser", deleteUserRoutes)

app.use("/likeEpisode", likeEpisodeRoutes)

// function generateAccessToken ( user) {
//   return jwt.sign({username : user.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
// }


app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
