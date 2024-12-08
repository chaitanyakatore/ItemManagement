const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;
const SECRET_KEY = "mysecretkey";

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "crud_app",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL database.");
});

// User Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err) => {
      if (err) return res.status(500).send("User registration failed.");
      res.status(201).send("User registered successfully.");
    }
  );
});

// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(400).send("Invalid credentials.");

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) return res.status(400).send("Invalid credentials.");

      const token = jwt.sign({ id: user.id }, SECRET_KEY);
      res.status(200).send({ token });
    }
  );
});

// Middleware for Authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send("Invalid token");
    req.userId = decoded.id;
    next();
  });
};

// CRUD Operations
app.get("/items", authenticate, (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) return res.status(500).send("Failed to fetch items.");
    res.status(200).json(results);
  });
});

app.post("/items", authenticate, (req, res) => {
  const { name, description } = req.body;

  db.query(
    "INSERT INTO items (name, description) VALUES (?, ?)",
    [name, description],
    (err) => {
      if (err) return res.status(500).send("Failed to add item.");
      res.status(201).send("Item added successfully.");
    }
  );
});

app.put("/items/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  db.query(
    "UPDATE items SET name = ?, description = ? WHERE id = ?",
    [name, description, id],
    (err) => {
      if (err) return res.status(500).send("Failed to update item.");
      res.status(200).send("Item updated successfully.");
    }
  );
});

app.delete("/items/:id", authenticate, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM items WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("Failed to delete item.");
    res.status(200).send("Item deleted successfully.");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
