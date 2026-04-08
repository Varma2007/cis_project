const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ MongoDB Connection (SAFE)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ✅ Schema
const AppSchema = new mongoose.Schema({
  name: String,
  category: String,
  version: String,
  usage_count: { type: Number, default: 0 }
});

const AppModel = mongoose.model("App", AppSchema);

// ✅ Root Route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("🚀 API Running");
});

// ✅ Get Apps
app.get("/apps", async (req, res) => {
  try {
    const apps = await AppModel.find();
    res.json(apps);
  } catch (err) {
    res.status(500).send("Error fetching apps");
  }
});

// ✅ Add App
app.post("/apps", async (req, res) => {
  try {
    const newApp = new AppModel(req.body);
    await newApp.save();
    res.json(newApp);
  } catch (err) {
    res.status(500).send("Error saving app");
  }
});

// ✅ Delete App
app.delete("/apps/:id", async (req, res) => {
  try {
    await AppModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).send("Error deleting app");
  }
});

// ✅ Increase Usage + Recommend
app.put("/use/:id", async (req, res) => {
  try {
    const appData = await AppModel.findById(req.params.id);

    await AppModel.findByIdAndUpdate(req.params.id, {
      $inc: { usage_count: 1 }
    });

    const recommendations = await AppModel.find({
      category: appData.category
    });

    res.json(recommendations);
  } catch (err) {
    res.status(500).send("Error updating usage");
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});