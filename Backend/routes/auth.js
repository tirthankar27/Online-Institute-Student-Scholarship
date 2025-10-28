const express = require("express");
const router = express.Router();
const {pool} = require("../db.js");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const allowedDesignations = ["admin", "authority", "student"];

// ----------------- Signup Route -----------------
router.post(
  "/signup",
  [
    body("user_id").notEmpty().withMessage("User ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("designation")
      .notEmpty()
      .withMessage("Designation is required")
      .custom((value) => allowedDesignations.includes(value))
      .withMessage(
        `Designation must be one of: ${allowedDesignations.join(", ")}`
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, name, email, password, designation } = req.body;

    try {
      // Check if user ID or email already exists
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE user_id = $1 OR email = $2",
        [user_id, email]
      );

      if (existingUser.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "User with this ID and email already exists" });
      }

      // Hash password with 10 salt rounds
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      const result = await pool.query(
        "INSERT INTO users (user_id, name, email, password, designation) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [user_id, name, email, hashedPassword, designation]
      );

      res.status(201).json({
        user_id: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        designation: result.rows[0].designation,
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Signup error:", error); // optional: log server-side
      res.status(500).json({ error: "Internal server error" }); // ✅ always JSON
    }
  }
);

// ----------------- Login Route -----------------
router.post(
  "/login",
  [
    body("user_id").notEmpty().withMessage("User ID is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, password } = req.body;

    try {
      // Find user by ID
      const result = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [user_id]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const user = result.rows[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Login successful
      res.json({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        message: "Login successful",
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
