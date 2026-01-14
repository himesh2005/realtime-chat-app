require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose");
const app = express()
const auth = require("./middleware/auth.js");


app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend is running")
})

app.get("/api/me", auth, (req, res) => {
  res.json({ message: "You are authorized", userId: req.userId });
});

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);

const PORT = 5000
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
