import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  console.log("GET REQUEST ALL USER");
  res.json({ message: "all users are found" });
});

module.exports = router;
