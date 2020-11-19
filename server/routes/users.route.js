const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("answers")
      .populate("questions");
    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: `Something went terribly wrong: ${e}` });
  }
});

module.exports = router;
