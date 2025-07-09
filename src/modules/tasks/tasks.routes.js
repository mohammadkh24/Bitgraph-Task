const express = require("express");
const upload = require("../../utils/taskUploader"); 
const controller = require("./tasks.controller");
const { auth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const isAdminOrTeacher = require("../../middlewares/isAdminOrTeacher");
const isAdmin = require("../../middlewares/isAdmin");
const {createTaskValidator} = require("./tasks.validator");
const isTeacher = require("../../middlewares/isTeacher");

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

router.get("/",auth, isAdmin ,controller.getAllTasks);

router.get("/teacher-taks",auth, isTeacher ,controller.getTasksForTeacher);

router.get("/:id",auth, isAdmin,controller.getTaskById);

router.patch("/:id/status",auth , isAdminOrTeacher ,controller.updateTaskStatus);

router.patch(
    "/:id/edit",
    auth,
    controller.editTaskByUser
  );
  

module.exports = router