const express = require("express");
const controller = require("./feedback.controller");
const { auth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const isAdminOrTeacher = require("../../middlewares/isAdminOrTeacher");
const { feedbackValidator } = require("./feedback.validator");

const router = express.Router();

router.post(
  "/",
  auth,
  isAdminOrTeacher,
  feedbackValidator,
  validate,
  controller.createFeedback
);

router.patch(
  "/:id",
  auth,
  isAdminOrTeacher,
  feedbackValidator,
  validate,
  controller.updateFeedback
);

router.delete("/:id", auth, isAdminOrTeacher, controller.deleteFeedback);

module.exports = router;
