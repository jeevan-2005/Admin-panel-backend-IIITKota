import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { app } from "./app.js";

const port = process.env.PORT || "8080";

app.listen(port, async () => {
  console.log(`Server is running on port:${port}`);
  connectDB();
});
