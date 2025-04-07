import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/database.js";
dotenv.config();
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
