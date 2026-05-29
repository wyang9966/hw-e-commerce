import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "./user.controller";

const router = Router();

router.get("/", getAllUsers);
router.get("/username/:username", getUserByUsername);
router.get("/email/:email", getUserByEmail);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
