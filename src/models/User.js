const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
      default: "/images/OIP.jpg",
    },
    courses: [{ 
      type: mongoose.Schema.Types.ObjectId,
       ref: "Course" }],

    role: {
      type: String,
      enum: ["STUDENT", "MANAGER", "TEACHER"],
      default: "STUDENT",
    },

    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    }
  },
  { timestamps: true }
);

const model = mongoose.model("User", schema);

module.exports = model;
