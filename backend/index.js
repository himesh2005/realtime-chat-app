require("dotenv").config()
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
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

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});
io.on("connection_error", (err) => {
  console.log("Socket connection_error:", err.message);
});


// Map userId -> socketId
const onlineUsers = new Map();

// Authenticate socket
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));
    console.log("Socket auth token exists?", !!socket.handshake.auth?.token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  onlineUsers.set(socket.userId, socket.id);
  console.log("User connected:", socket.userId);

  socket.on("private_message", ({ toUserId, text }) => {
    const toSocketId = onlineUsers.get(toUserId);
    if (!toSocketId) {
      socket.emit("error_message", { message: "User offline" });
      return;
    }

    io.to(toSocketId).emit("private_message", {
      fromUserId: socket.userId,
      text,
    });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.userId);
    console.log("User disconnected:", socket.userId);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
