const express = require("express");
const router = express.router;
const pool = require("../db");

//Insert new scholarships
router.post("/insertScholarship", async (req, res) => {
  try {
    const { org, info, deadline } = req.body;
    const insertResult = await pool.query(
      "INSERT INTO scholarship (organization, description, deadline) VALUES ($1, $2, $3) RETURNING *",
      [org, info, deadline]
    );
    res.status(201).json({
      message: "Scholarship inserted successfully",
      scholarship: insertResult.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      // unique constraint violation
      return res.status(400).json({ message: "Scholarship already exists" });
    }
    console.error("Error inserting scholarship:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Fetch all the available scholarships
router.get("/schemes", async (res, req) => {
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
