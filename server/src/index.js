import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { registerSocketHandlers } from "./socket/index.js";
import { startScheduler } from "./utils/scheduler.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true
  }
});

app.set("io", io);
registerSocketHandlers(io);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    startScheduler(io);
    server.listen(PORT, () => {
      console.log(`LUMORA server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
