import express from "express";
import { deleteUser } from "../controllers/deleteUserController.js";

const router = express.Router();

// Route POST : Quand on appelle /deleteUser, on lance la fonction 'deleteUser' du contrôleur
router.post("/", deleteUser);

export default router;