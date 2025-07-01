const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    username : {
      type: String,
      unique: true,
    },
    avatar : {
      type : String ,
      default : "/images/OIP.jpg"
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN" , "TEACHER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("User", schema);

module.exports = model;
