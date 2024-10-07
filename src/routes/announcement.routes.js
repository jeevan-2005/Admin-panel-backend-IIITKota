import express from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller.js";
import { authorizeRoles, isAuth } from "../middlewares/auth.middleware.js";

const announcementRouter = express.Router();

announcementRouter.get("/", isAuth, getAnnouncements);
announcementRouter.post(
  "/create",
  isAuth,
  authorizeRoles("admin", "superAdmin"),
  createAnnouncement
);
announcementRouter.put(
  "/update/:id",
  isAuth,
  authorizeRoles("admin", "superAdmin"),
  updateAnnouncement
);
announcementRouter.delete(
  "/delete/:id",
  isAuth,
  authorizeRoles("admin", "superAdmin"),
  deleteAnnouncement
);

export default announcementRouter;
