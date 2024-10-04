import dotenv from "dotenv";
dotenv.config();
import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import { UserModel } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";
import path from "path";
import sendMail from "../utils/mailSender";

const registerUser = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      role,
    });

    const { activationCode, activationToken } =
      createActivationCredentials(user);

    const mailData = {
      user: {
        name: user.name,
      },
      activationCode,
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activationMail.ejs"),
      mailData
    );

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activationMail.ejs",
        data: mailData,
      });

      return res.status(201).json({
        success: true,
        message: `Please check your email ${user.email} to activate your account`,
        activationToken,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const createActivationCredentials = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const activationToken = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  return { activationCode, activationToken };
};

const activateUser = catchAsyncError(async (req, res, next) => {
  try {
    const { activationToken, activationCode } = req.body;

    const newUser = jwt.verify(
      activationToken,
      process.env.ACTIVATION_TOKEN_SECRET
    );

    if (newUser.activationCode !== activationCode) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password, role } = newUser.user;

    await UserModel.create({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "user activated and registered successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export { registerUser, activateUser };
