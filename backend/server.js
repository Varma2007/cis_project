const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 Replace with your MongoDB Atlas URL
mongoose.connect("mongodb+srv://varma:Varma@272@cluster0.vfhzinu.mongodb.net/?appName=Cluster0")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const AppSchema = new mongoose.Schema({
  name: String,
  category: String,
  version: String,
  dependencies: [String],
  usage_count: { type: Number, default: 0 }
});

const AppModel = mongoose.model("App", AppSchema);

// CREATE
app.post("/apps", async (req, res) => {
  const appData = new AppModel(req.body);
  await appData.save();
  res.json(appData);
});

// READ
app.get("/apps", async (req, res) => {
  const apps = await AppModel.find();
  res.json(apps);
});

// DELETE
app.delete("/apps/:id", async (req, res) => {
  await AppModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// RECOMMENDATION
app.get("/recommend/:category", async (req, res) => {
  const apps = await AppModel.find({ category: req.params.category });
  res.json(apps);
});

// INCREASE USAGE
app.put("/use/:id", async (req, res) => {
  await AppModel.findByIdAndUpdate(req.params.id, {
    $inc: { usage_count: 1 }
  });
  res.json({ message: "Updated usage" });
});

app.listen(5000, () => console.log("Server running on port 5000"));