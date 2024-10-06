import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import announcementRouter from "./routes/announcement.routes.js";

export const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/announcement", announcementRouter);

app.get("/health-check", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Health-Check : server is running fine.",
  });
});

app.all("*", (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found!`);
  error.status = 404;
  next(err);
});

app.use(errorMiddleware);
