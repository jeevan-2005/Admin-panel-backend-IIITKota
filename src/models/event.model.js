import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    imageurl: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid date format! Use DD/MM/YYYY.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const EventModel = mongoose.model("Event", eventSchema);
