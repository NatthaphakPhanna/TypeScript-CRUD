const express = require('express');
const app = express();
const cors = require('cors')
const mysql = require('mysql')

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud"
})

app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students"
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err)
    } else {
      res.send(result)
    }
  });
});

app.post("/students", (req, res) => {
  const { firstname, lastname, email, portfolio } = req.body;
  const sql = "INSERT INTO students (firstname, lastname, email, portfolio) VALUES (?, ?, ?, ?)";
  db.query(sql, [firstname, lastname, email, portfolio], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error inserting data");
    } else {
      const newStudent = {
        id: result.insertId,
        firstname,
        lastname,
        email,
        portfolio,
      };
      res.status(201).json(newStudent);
    }
  });
});

app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, portfolio } = req.body;
  const sql = "UPDATE students SET firstname = ?, lastname = ?, email = ?, portfolio = ? WHERE id = ?";
  db.query(sql, [firstname, lastname, email, portfolio, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating data");
    } else {
      res.status(200).json({ id, firstname, lastname, email, portfolio });
    }
  });

});

app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM students WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (!err) {
      res.status(201).send(result)
    } else {
      console.error(err)
    }
  })
})

const port = process.env.port || 5000
app.listen(port, () => {
  console.log(`Start server on port ${port}`)
})
