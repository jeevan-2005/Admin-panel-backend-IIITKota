import mongoose from "mongoose";

const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return dateRegex.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid date format! Use DD/MM/YYYY.`,
      },
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AnnouncementModel = mongoose.model(
  "Announcement",
  announcementSchema
);
