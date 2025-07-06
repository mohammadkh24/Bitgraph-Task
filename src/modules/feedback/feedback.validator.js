const { body } = require("express-validator");

const feedbackValidator = [
  body("text")
    .notEmpty()
    .withMessage("توضیحات الزامی است.")
    .isLength({ min: 3 })
    .withMessage("توضیحات باید حداقل3 حرف باشد."),
];

module.exports = {
  feedbackValidator,
};
