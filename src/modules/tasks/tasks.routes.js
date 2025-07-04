const express = require("express");
const upload = require("../../utils/taskUploader"); // آپلودر مولتر
const controller = require("./tasks.controller");
const { auth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const isAdminOrTeacher = require("../../middlewares/isAdminOrTeacher");
const validator = require("./tasks.validator")

const router = express.Router();

router.post(
  "/",
  auth,
  upload.single("file"),
  validator,
  validate,
  controller.createTask
);

router.get("/",auth, isAdminOrTeacher ,controller.getAllTasks);

router.get("/:id",auth, isAdminOrTeacher,controller.getTaskById);

router.patch("/:id/status",auth , isAdminOrTeacher ,controller.updateTaskStatus);

module.exports = router