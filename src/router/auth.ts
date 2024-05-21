import express from "express";
import {
  loginController,
  logoutController,
  registerConroller,
} from "../controller/auth";

const router = express.Router();

router.post("/register", registerConroller);
router.post("/login", loginController);
router.post("/logout", logoutController);

export default router;
