const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to the database.");
  }
});

app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch students" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/students", (req, res) => {
  const { firstname, lastname, email, portfolio } = req.body;
  const sql =
    "INSERT INTO students (firstname, lastname, email, portfolio) VALUES (?, ?, ?, ?)";
  db.query(sql, [firstname, lastname, email, portfolio], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to add student" });
    } else {
      res
        .status(201)
        .json({ id: result.insertId, firstname, lastname, email, portfolio });
    }
  });
});

app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, portfolio } = req.body;
  const sql =
    "UPDATE students SET firstname = ?, lastname = ?, email = ?, portfolio = ? WHERE id = ?";
  db.query(sql, [firstname, lastname, email, portfolio, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to update student" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.status(200).json({ id, firstname, lastname, email, portfolio });
    }
  });
});

app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM students WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete student" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.status(200).json({ message: "Student deleted successfully" });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
