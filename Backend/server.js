require("dotenv").config({ path: __dirname + "/.env" });
const { connectToDB } = require("./db.js");
const express = require("express");
const path = require('path');
const cors = require("cors");

const app = express();
const port = 5001;

const uploadsPath = path.join(__dirname, '../uploads');
console.log('Static files serving from:', uploadsPath);

app.use('/uploads', express.static(uploadsPath));

// Simple CORS - allow everything
app.use(cors());

app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

//Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/scholarship", require("./routes/scholarship.js"));
app.use("/api/application", require("./routes/application.js"));

const startServer = async () => {
  try {
    await connectToDB();
    app
      .listen(port, () => {
        console.log(`Scholarship backend running on http://localhost:${port}`);
      })
      .on("error", (err) => {
        console.error("Server error:", err);
      });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
