import { EventModel } from "../models/event.model.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const getEvents = catchAsyncError(async (req, res, next) => {
  try {
    const events = await EventModel.find();
    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const createEvent = catchAsyncError(async (req, res, next) => {
  try {
    const { title, description, imageurl, date } = req.body;

    const event = await EventModel.create({
      title,
      description,
      imageurl,
      date,
    });
    if (!event) {
      return next(new ErrorHandler("Error occured while creating event", 400));
    }

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const updateEvent = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, imageurl, date } = req.body;

    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        imageurl,
        date,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedEvent) {
      return next(new ErrorHandler("Event not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      updatedEvent,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const deleteEvent = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedEvent = await EventModel.findByIdAndDelete(id);
    if (!deletedEvent) {
      return next(new ErrorHandler("Event not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      deletedEvent,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export { getEvents, createEvent, updateEvent, deleteEvent };
