import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controller/test";

import { verifyToken } from "../middleware/verifytoken";

const router = express.Router();

router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);
router.get("/should-be-admin", shouldBeAdmin);

export default router;
