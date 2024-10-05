import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { UserModel } from "../models/user.model.js";
import catchAsyncError from "./catchAsyncError.middleware.js";

export const isAuth = catchAsyncError(async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return next(new ErrorHandler("Please login first", 401));
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return next(new ErrorHandler("Please login first", 401));
    }
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("Please login first", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  }
}