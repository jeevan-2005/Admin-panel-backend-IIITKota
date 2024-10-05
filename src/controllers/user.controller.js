import dotenv from "dotenv";
dotenv.config();
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { UserModel } from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import path from "path";
import sendMail from "../utils/mailSender.js";
import ejs from "ejs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registerUser = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = {
      name,
      email,
      password,
      role,
    };

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

    if (!newUser) {
      return next(
        new ErrorHandler("Invalid activation Token or Token Expired.", 400)
      );
    }

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

const userLogin = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatched = await user.matchPassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();

    const accessTokenOptions = {
      expires: new Date(
        Date.now() + process.env.ACCESS_TOKEN_EXPIRE * 60 * 1000
      ),
      maxAge: process.env.ACCESS_TOKEN_EXPIRE * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    };
    const refreshTokenOptions = {
      expires: new Date(
        Date.now() + process.env.REFRESH_TOKEN_EXPIRE * 24 * 60 * 60 * 1000
      ),
      maxAge: process.env.REFRESH_TOKEN_EXPIRE * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    };

    // only set secure to true in production
    if (process.env.NODE_ENV === "production") {
      accessTokenOptions.secure = true;
    }

    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getNewAccessToken = catchAsyncError(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return next(new ErrorHandler("Please login again", 401));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return next(new ErrorHandler("Please login again", 401));
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("Please login again", 401));
    }

    const accessToken = user.signAccessToken();

    res.cookie("accessToken", accessToken, {
      expires: new Date(
        Date.now() + process.env.ACCESS_TOKEN_EXPIRE * 60 * 1000
      ),
      maxAge: process.env.ACCESS_TOKEN_EXPIRE * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "New access token generated",
      accessToken,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const userLogout = catchAsyncError(async (req, res, next) => {
  try {
    res.cookie("accessToken", "", {maxAge: 1});
    res.cookie("refreshToken", "", {maxAge: 1});
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})

export { registerUser, activateUser, userLogin, getNewAccessToken ,userLogout};
