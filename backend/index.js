const express = require("express")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")

const app = express()
app.use(cors())
app.use(express.json())

// test route
app.get("/", (req, res) => {
  res.send("Backend is running")
})

// login route
app.post("/login", (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: "Email required" })
  }

  const userId = uuidv4()
  res.json({ userId, email })
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
