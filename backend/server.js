const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// 🔥 SAFE START (prevents crash)
(async () => {
  try {
    await mongoose.connect("mongodb+srv://varma:Varma%40272@cluster0.vfhzinu.mongodb.net/mydb");
    console.log("✅ DB Connected");
  } catch (err) {
    console.log("❌ DB Error:", err);
  }
})();

// ✅ Schema
const AppSchema = new mongoose.Schema({
  name: String,
  category: String,
  version: String,
  usage_count: { type: Number, default: 0 }
});

const AppModel = mongoose.model("App", AppSchema);

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("🚀 API Running");
});

// ✅ GET APPS
app.get("/apps", async (req, res) => {
  try {
    const apps = await AppModel.find();
    res.json(apps);
  } catch (err) {
    res.status(500).send("Error fetching apps");
  }
});

// ✅ ADD APP
app.post("/apps", async (req, res) => {
  try {
    const newApp = new AppModel(req.body);
    await newApp.save();
    res.json(newApp);
  } catch (err) {
    res.status(500).send("Error saving app");
  }
});

// ✅ DELETE APP
app.delete("/apps/:id", async (req, res) => {
  try {
    await AppModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).send("Error deleting app");
  }
});

// ✅ START SERVER (IMPORTANT FIX)
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port " + PORT);
});