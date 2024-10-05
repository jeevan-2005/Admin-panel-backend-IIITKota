import express from "express";
import {
  activateUser,
  getNewAccessToken,
  registerUser,
  userLogin,
  userLogout,
} from "../controllers/user.controller.js";
import { authorizeRoles, isAuth } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", userLogin);
userRouter.get("/refresh-token", getNewAccessToken);
userRouter.get("/logout", isAuth ,userLogout);

export default userRouter;
