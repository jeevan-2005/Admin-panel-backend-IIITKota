import { AnnouncementModel } from "../models/announcement.model.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const getAnnouncements = catchAsyncError(async (req, res, next) => {
  try {
    const announcements = await AnnouncementModel.find();
    return res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const createAnnouncement = catchAsyncError(async (req, res, next) => {
  try {
    const { title, description, date, link } = req.body;

    const announcement = await AnnouncementModel.create({
      title,
      description,
      date,
      link,
    });

    return res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const updateAnnouncement = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const announcement = await AnnouncementModel.findById(id);
    if (!announcement) {
      return next(new ErrorHandler("Announcement not found", 404));
    }

    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      updatedAnnouncement,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const deleteAnnouncement = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const announcement = await AnnouncementModel.findByIdAndDelete(id);
    if (!announcement) {
      return next(new ErrorHandler("Announcement not found", 404));
    }
    return res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
