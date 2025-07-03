const express = require("express");
const router = express.Router();
const {createCourseValidator} = require("./courses.validator")
const controller = require("./course.controller");
const validate = require("../../middlewares/validate");
const { auth } = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin")


router.post("/", auth, isAdmin, createCourseValidator, validate, controller.createCourse);

router.get("/", controller.getAllCourses);

router.get("/:id", controller.getCourseById);

router.put("/:id", auth , isAdmin , createCourseValidator, validate, controller.updateCourse);

router.delete("/:id",auth , isAdmin ,controller.deleteCourse);

module.exports = router;
