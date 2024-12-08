const express = require("express");
const mongoose = require("mongoose");
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

// MongoDB connection
const mongoURI =
  "mongodb+srv://root:root@cluster0.9eyfu.mongodb.net/myDatabase";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB database."))
  .catch((err) => console.error("Database connection failed:", err.message));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Define Item Schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Create Models
const User = mongoose.model("User", userSchema);
const Item = mongoose.model("Item", itemSchema);

// User Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered successfully.");
  } catch (err) {
    res.status(500).send("User registration failed.");
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("Invalid credentials.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send("Invalid credentials.");

    const token = jwt.sign({ id: user._id }, SECRET_KEY);
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send("Login failed.");
  }
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
app.get("/items", authenticate, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.userId });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).send("Failed to fetch items.");
  }
});

app.post("/items", authenticate, async (req, res) => {
  const { name, description } = req.body;

  try {
    const newItem = new Item({ name, description, userId: req.userId });
    await newItem.save();
    res.status(201).send("Item added successfully.");
  } catch (err) {
    res.status(500).send("Failed to add item.");
  }
});

app.put("/items/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    await Item.findByIdAndUpdate(id, { name, description });
    res.status(200).send("Item updated successfully.");
  } catch (err) {
    res.status(500).send("Failed to update item.");
  }
});

app.delete("/items/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    await Item.findByIdAndDelete(id);
    res.status(200).send("Item deleted successfully.");
  } catch (err) {
    res.status(500).send("Failed to delete item.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
