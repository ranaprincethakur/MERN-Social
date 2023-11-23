import express from "express";
import { UserLogin, registerUser } from "../Controllers/AuthController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", UserLogin);

export default router;
