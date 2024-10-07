import express from "express";
import { authorizeRoles, isAuth } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../controllers/events.controllers.js";

const eventRouter = express.Router();

eventRouter.get("/", isAuth, getEvents);
eventRouter.post("/create", isAuth, authorizeRoles("superAdmin"), createEvent);
eventRouter.put("/update/:id", isAuth, authorizeRoles("superAdmin"), updateEvent);
eventRouter.delete(
  "/delete/:id",
  isAuth,
  authorizeRoles("superAdmin"),
  deleteEvent
);

export default eventRouter;
