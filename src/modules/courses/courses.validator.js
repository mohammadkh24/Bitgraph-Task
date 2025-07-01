const { body } = require("express-validator");

exports.createCourseValidator = [
  body("title")
    .notEmpty()
    .withMessage("عنوان دوره نباید خالی باشد.")
    .isLength({ min: 3 })
    .withMessage("عنوان دوره باید حداقل ۳ کاراکتر داشته باشد.")
];
