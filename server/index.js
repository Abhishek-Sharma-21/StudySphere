import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./database/db.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import likeRoutes from "./routes/like.route.js";
import commentRoutes from "./routes/comment.route.js";
import groupRoutes from "./routes/group.route.js";
import liveSyncRoutes from "./routes/liveSync.route.js";

import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/socket.js";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

initSocket(io);

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", likeRoutes);
app.use("/api", commentRoutes);
app.use("/api", groupRoutes);
app.use("/api/live-sync", liveSyncRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "StudySphere Server is running" });
});


const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  connectDb();
  console.log(`Server is running on http://localhost:${port}`);
});

