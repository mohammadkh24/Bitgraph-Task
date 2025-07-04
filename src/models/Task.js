const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["بررسی شده", "بررسی نشده"],
      default: "بررسی نشده",
    },
    feedback: {
      type: mongoose.Types.ObjectId,
      ref: "Feedback",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Task", schema);

module.exports = model;
