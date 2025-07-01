const express = require("express");
const router = express.Router();
const {createCourseValidator} = require("./courses.validator")
const controller = require("./");
const validate = require("../../middlewares/validate");


router.post("/", createCourseValidator, validate, controller.createCourse);

router.get("/", controller.getAllCourses);

router.get("/:id", controller.getCourseById);

router.put("/:id", createCourseValidator, validate, controller.updateCourse);

router.delete("/:id", controller.deleteCourse);

module.exports = router;
