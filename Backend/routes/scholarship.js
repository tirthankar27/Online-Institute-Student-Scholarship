const express = require("express");
const router = express.Router();
const {pool} = require("../db.js");

// Middleware to check if user is admin
// function isAdmin(req, res, next) {
//   if (req.user.designation !== "admin") {
//     return res.status(403).json({ message: "Access denied: Admins only" });
//   }
//   next();
// }

function isAdmin(req, res, next) {
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

    if (result.rows.length === 0) {
      return res
        .status(200)
        .json({ message: "No scholarships found", data: [] });
    }

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Fetch a particular scholarships (Everyone) -----------------

router.get("/scheme/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM scholarship WHERE scholarship_id = $1", [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(200)
        .json({ message: "No scholarships found", data: [] });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
