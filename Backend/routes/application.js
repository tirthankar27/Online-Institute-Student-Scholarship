const express = require("express");
const router = express.Router();
const pool = require("../db");

// Middleware: Only students can apply
function isStudent(req, res, next) {
  if (!req.user || req.user.designation !== "student") {
    return res.status(403).json({ message: "Access denied: Students only" });
  }
  next();
}

// Middleware: Only admin or authority can verify/view applications
function canVerify(req, res, next) {
  if (!req.user || !["admin", "authority"].includes(req.user.designation)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

// ----------------- Apply for scholarship (Student only) -----------------
router.post("/apply", isStudent, async (req, res) => {
  try {
    const {
      scholarship_id,
      name,
      dob,
      father_name,
      mother_name,
      institute_name,
      cgpa,
      marks_12,
      category_certificate,
      recent_sem_marksheet,
      marksheet_12,
      id_card
    } = req.body;

    if (
      !scholarship_id || !name || !dob || !father_name || !mother_name ||
      !institute_name || !cgpa || !marks_12 || !recent_sem_marksheet || !marksheet_12 || !id_card
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const insertResult = await pool.query(
      `INSERT INTO application 
      (scholarship_id, user_id, name, dob, father_name, mother_name, institute_name, cgpa, marks_12, category_certificate, recent_sem_marksheet, marksheet_12, id_card, verified_by_authority, verified_by_admin, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,false,false,'Under Authority Verification')
      RETURNING *`,
      [
        scholarship_id,
        req.user.user_id,
        name,
        dob,
        father_name,
        mother_name,
        institute_name,
        cgpa,
        marks_12,
        category_certificate || null,
        recent_sem_marksheet,
        marksheet_12,
        id_card
      ]
    );

    res.status(201).json({
      message: "Application submitted successfully",
      application: insertResult.rows[0]
    });
  } catch (error) {
    console.error("Error applying for scholarship:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Get all applications (Admin/Authority only) -----------------
router.get("/applications", canVerify, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM application ORDER BY application_id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Verify application by authority/admin -----------------
router.patch("/verify/:application_id", canVerify, async (req, res) => {
  try {
    const { application_id } = req.params;
    const { byAuthority, byAdmin } = req.body;

    if (byAuthority === undefined && byAdmin === undefined) {
      return res.status(400).json({ message: "Provide at least one verification field" });
    }

    let query = "UPDATE application SET ";
    let params = [];
    let i = 1;

    if (byAuthority !== undefined) {
      query += `verified_by_authority = $${i}, status = $${i + 1} `;
      params.push(byAuthority, byAuthority ? "Under Admin Verification" : "Under Authority Verification");
      i += 2;
    }

    if (byAdmin !== undefined) {
      if (byAuthority !== undefined) query += ", ";
      query += `verified_by_admin = $${i}, status = $${i + 1} `;
      params.push(byAdmin, byAdmin ? "Approved" : "Under Admin Verification");
      i += 2;
    }

    query += `WHERE application_id = $${i} RETURNING *`;
    params.push(application_id);

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application updated successfully", application: result.rows[0] });
  } catch (error) {
    console.error("Error verifying application:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Get all applications of the logged-in student -----------------
router.get("/my-applications", isStudent, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      "SELECT * FROM application WHERE user_id = $1 ORDER BY application_id DESC",
      [userId]
    );

    res.json({
      message: "Your applications fetched successfully",
      applications: result.rows
    });
  } catch (error) {
    console.error("Error fetching student's applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;