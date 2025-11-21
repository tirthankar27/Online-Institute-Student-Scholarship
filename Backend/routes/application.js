const express = require("express");
const router = express.Router();
const { pool } = require("../db.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.body.roll_number;
    const userFolder = path.join("uploads", "applications", userId.toString());

    // Ensure the directory exists synchronously
    try {
      fs.mkdirSync(userFolder, { recursive: true });
      cb(null, userFolder);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// // Middleware: Only students can apply
// function isStudent(req, res, next) {
//   if (!req.user || req.user.designation !== "student") {
//     return res.status(403).json({ message: "Access denied: Students only" });
//   }
//   next();
// }

// // Middleware: Only admin or authority can verify/view applications
// function canVerify(req, res, next) {
//   if (!req.user || !["admin", "authority"].includes(req.user.designation)) {
//     return res.status(403).json({ message: "Access denied" });
//   }
//   next();
// }

// ----------------- Apply for scholarship (Student only) -----------------
router.post(
  "/apply",
  upload.fields([
    { name: "id_card", maxCount: 1 },
    { name: "category_certificate", maxCount: 1 },
    { name: "recent_sem_marksheet", maxCount: 1 },
    { name: "marksheet_12", maxCount: 1 },
  ]),
  async (req, res) => {
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
        email,
        roll_number,
        course,
      } = req.body;

      // Get file paths from uploaded files
      const id_card = req.files.id_card ? req.files.id_card[0].path : null;
      const category_certificate = req.files.category_certificate
        ? req.files.category_certificate[0].path
        : null;
      const recent_sem_marksheet = req.files.recent_sem_marksheet
        ? req.files.recent_sem_marksheet[0].path
        : null;
      const marksheet_12 = req.files.marksheet_12
        ? req.files.marksheet_12[0].path
        : null;

      if (
        !scholarship_id ||
        !name ||
        !dob ||
        !father_name ||
        !mother_name ||
        !institute_name ||
        !cgpa ||
        !marks_12 ||
        !recent_sem_marksheet ||
        !marksheet_12 ||
        !id_card ||
        !email ||
        !roll_number ||
        !course
      ) {
        return res
          .status(400)
          .json({ message: "All required fields must be filled" });
      }

      const insertResult = await pool.query(
        "INSERT INTO application (scholarship_id, student_name, dob, father_name, mother_name, institute_name, cgpa, percent_12th, category_certificate, recent_sem_marksheet, marksheet_12th, id_card, user_id, email, roll, course) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *",
        [
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
          id_card,
          roll_number,
          email,
          roll_number,
          course,
        ]
      );

      res.status(201).json({
        message: "Application submitted successfully",
        application: insertResult.rows[0],
      });
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ----------------- Get all applications (Admin/Authority only) -----------------
router.get("/applications", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM application ORDER BY application_id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Verify application by authority/admin -----------------
router.patch("/verify/:application_id", async (req, res) => {
  try {
    const { application_id } = req.params;
    const { status, review_comment, byAuthority, byAdmin } = req.body;

    console.log("Received request:", {
      application_id,
      status,
      review_comment,
      byAuthority,
      byAdmin,
    });

    // Check if required fields are present
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // More flexible status validation
    const validStatuses = [
      "Pending",
      "Approved by Authority",
      "Rejected by Authority",
      "Approved by Admin",
      "Rejected by Admin",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        received: status,
        validStatuses: validStatuses,
      });
    }

    // Determine verification flags based on status
    const verified_by_authority = byAuthority;
    const verified_by_admin = byAdmin;

    console.log("Verification flags:", {
      verified_by_authority,
      verified_by_admin,
    });

    const query = `
      UPDATE application 
      SET status = $1,
          verified_by_authority = $2,
          verified_by_admin = $3
      WHERE application_id = $4
      RETURNING *
    `;

    const params = [
      status,
      verified_by_authority,
      verified_by_admin,
      application_id,
    ];

    console.log("Executing query with params:", params);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application updated successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Error verifying application:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ----------------- Get all applications of the logged-in student -----------------
router.post("/my-applications", async (req, res) => {
  try {
    const userId = req.body.user_id;

    const result = await pool.query(
      "SELECT * FROM application WHERE user_id = $1 ORDER BY application_id DESC",
      [userId]
    );

    res.json({
      message: "Your applications fetched successfully",
      applications: result.rows,
    });
  } catch (error) {
    console.error("Error fetching student's applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/approved", async (req, res) => {
  try {
    const { application_id, scholarship_id, user_id, name, institute, amount } =
      req.body;

    console.log(req.body);

    const result = await pool.query(
      `INSERT INTO approved_applications 
        (application_id, scholarship_id, user_id, name, institute, amount)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [application_id, scholarship_id, user_id, name, institute, amount]
    );

    res.status(201).json({
      message: "Student has been approved for scholarship",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/approved_application", async (req, res) => {
  try {
    const { application_id } = req.body;

    if (!application_id) {
      return res.status(400).json({
        success: false,
        message: "application_id is required",
      });
    }

    const result = await pool.query(
      `SELECT amount, renewal_date 
       FROM approved_applications 
       WHERE application_id = $1`,
      [application_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No approved application found for this application_id",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching approved application:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
