const express = require("express");
const upload = require("../../utils/taskUploader"); 
const controller = require("./tasks.controller");
const { auth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const isAdminOrTeacher = require("../../middlewares/isAdminOrTeacher");
const {createTaskValidator} = require("./tasks.validator")

const router = express.Router();

router.post(
  "/",
  auth,
  upload.single("file"),
  createTaskValidator,
  validate,
  controller.createTask
);

router.get("/me", auth, controller.getMyTasks);

router.get("/",auth, isAdminOrTeacher ,controller.getAllTasks);

router.get("/:id",auth, isAdminOrTeacher,controller.getTaskById);

router.patch("/:id/status",auth , isAdminOrTeacher ,controller.updateTaskStatus);

router.patch(
    "/:id/edit",
    auth,
    controller.editTaskByUser
  );
  

module.exports = router