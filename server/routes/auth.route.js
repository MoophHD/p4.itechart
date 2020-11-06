const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/user.model");
const {
  createToken,
  verifyPassword,
  hashPassword,
} = require("../utils/authentification");

router.post(
  "/login",
  [
    check("email", "Enter correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data for login",
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({
        email,
      });
      if (!user) {
        return res.status(403).json({
          message: "Wrong email or password.",
        });
      }

      if (verifyPassword(password, user.password)) {
        return res.status(400).json({ message: "Wrong email or password." });
      }

      const token = createToken(user);
      res.json({ token, userId: user.id });
    } catch (e) {
      res
        .status(500)
        .json({ message: `Something went wrong while logging in: ${e}` });
    }
  }
);

router.post(
  "/register",
  [
    check("email", "Incorrect email").isEmail(),
    check("password", "Minimal length 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data for registration",
        });
      }
      
      const {
        email,
        password,
        firstName,
        lastName,
        jobPosition,
        jobExperience,
        techStack,
      } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate) {
        res.status(400).json({ message: `User already exists` });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        jobPosition,
        jobExperience,
        techStack,
      });
      const savedUser = await user.save();
      const token = createToken(savedUser);
      res.json({ token, userId: savedUser.id });
      res.status(201).json({ userId: savedUser.id, token });
    } catch (e) {
      res
        .status(500)
        .json({ message: `Something went wrong while registering user: ${e}` });
    }
  }
);

module.exports = router;
