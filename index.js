const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes"); // Routes go here
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./model/Message");
const messageDelete=require("./routes/messageDelete");
dotenv.config(); // Load environment variables
connectDB(); // Connect to the database

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",                // local dev
  "https://campusconnectitis.vercel.app",     // production
];

const io = socketio(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
//middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);// Allow cross-origin requests


app.use(express.json()); // Parse JSON bodies

const cookieParser = require("cookie-parser");

app.use(cookieParser());
// Use routes
app.use("/api/auth", authRoutes); // Authentication routes
app.get("/", (req, res) => res.send("CampusConnect API is running..."));
app.use("/api/messages", messageRoutes);

app.use("/api/messages-delete",messageDelete)
//Sockets Events
io.on("connection", (socket) => {
 

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage",  ({ roomId, message}) => {
    if (!message || !message.content || message.content.trim() === "") {
      console.warn("⛔ Skipping empty message (from socket)");
      return;
    }

    try {     

      io.to(roomId).emit("receiveMessage", message);
    } catch (err) {
      console.error("Socket Message Error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
