const express = require("express");
const router = express.Router();
const pool = require("../db");

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (!req.user || req.user.designation !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

// ----------------- Insert new scholarship (Admin only) -----------------
router.post("/insertScholarship", isAdmin, async (req, res) => {
  try {
    const { title, organization, description, deadline, amount } = req.body;

    if (!title || !organization || !description || !deadline || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const insertResult = await pool.query(
      "INSERT INTO scholarship (title, organization, description, deadline, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, organization, description, deadline, amount]
    );

    res.status(201).json({
      message: "Scholarship inserted successfully",
      scholarship: insertResult.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Scholarship already exists" });
    }
    console.error("Error inserting scholarship:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Fetch all scholarships (Everyone) -----------------
router.get("/schemes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM scholarship ORDER BY deadline ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;