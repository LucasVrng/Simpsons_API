import express from "express";
import { likeEpisode } from "../controllers/likeEpisodeController.js";

const router = express.Router();

// Route POST : Quand on appelle /likeEpisode, on lance la fonction 'likeEpisode' du contrôleur
router.post("/", likeEpisode);

export default router;