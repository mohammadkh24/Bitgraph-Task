const { body } = require("express-validator");
const { isValidObjectId } = require("mongoose");

exports.createCourseValidator = [
  body("title")
    .notEmpty()
    .withMessage("عنوان دوره الزامی است.")
    .isLength({ min: 3 })
    .withMessage("عنوان دوره باید حداقل ۳ کاراکتر باشد."),

  body("teacherId")
    .notEmpty()
    .withMessage("شناسه مدرس الزامی است.")
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error("شناسه مدرس معتبر نیست.");
      }
      return true;
    })
];
