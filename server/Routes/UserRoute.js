import express from "express";
import {
  deleteUser,
  followUser,
  getUser,
  unFollowUser,
  updateUser,
  getAllUsers,
} from "../Controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", getUser);

router.put("/:id", authMiddleware, updateUser);

router.delete("/:id", authMiddleware, deleteUser);

router.put("/:id/follow", authMiddleware, followUser);

router.put("/:id/unfollow", authMiddleware, unFollowUser);

router.get("/", getAllUsers);

export default router;
