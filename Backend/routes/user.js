const express = require("express");
const router = express.router;
const pool = require("../db");
const bcrypt = require("bcrypt");

//Register User
router.post("/signup", async (req, res) => {
  try {
    const { id, name, designation, password } = req.body;

    //Check if user exist
    const existingUser = await pool.query("SELECT * FROM Users WHERE id = $1", [
      id,
    ]);
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this ID already exists" });
    }

    //Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //Insert new user
    const result = await pool.query(
      "INSERT INTO users (user_id, username, designation, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, name, designation, hashedPassword]
    );
    res.status(201).json({
      user_id: result.rows[0].user_id,
      username: result.rows[0].username,
      designation: result.rows[0].designation,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Login user
router.post("/login", async (req, res) => {
  try {
    const {id, password} = req.body;

    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);

    //Check if users does not exist
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    //Login succesfully
    res.json({
      user_id: user.user_id,
      username: user.username,
      designation: user.designation,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
