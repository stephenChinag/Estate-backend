import express from "express";
import { getUsers, getUser, updateUser, deleteUser } from "../controller/user";
import { verifyToken } from "../middleware/verifytoken";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.post("/:id", verifyToken, deleteUser);

export default router;
