import express from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller";
import { isAuth } from "../middlewares/auth.middleware";

const announcementRouter = express.Router();

announcementRouter.get("/announcements", getAnnouncements);
announcementRouter.post(
  "/create-announcement",
  isAuth("admin", "superAdmin"),
  createAnnouncement
);
announcementRouter.put(
  "/update-announcement",
  isAuth("admin", "superAdmin"),
  updateAnnouncement
);
announcementRouter.delete(
  "/delete-announcement",
  isAuth("admin", "superAdmin"),
  deleteAnnouncement
);

export default announcementRouter;
