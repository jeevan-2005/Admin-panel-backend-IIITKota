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
      message: "Announcement created successfully", 
      announcement,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const updateAnnouncement = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, link } = req.body;

    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        link,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
      return next(new ErrorHandler("Announcement not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
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
      message: "Announcement deleted successfully",
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
