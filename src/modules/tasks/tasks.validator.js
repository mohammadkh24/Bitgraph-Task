const { body } = require("express-validator");

const createTaskValidator = [
  body("description")
    .notEmpty()
    .withMessage("توضیحات الزامی است.")
    .isLength({ min: 5 })
    .withMessage("توضیحات باید حداقل ۵ حرف باشد."),

  body("courseId")
    .notEmpty()
    .withMessage("آیدی دوره الزامی است.")
    .isMongoId()
    .withMessage("آیدی دوره نامعتبر است."),

  body("userId")
    .notEmpty()
    .withMessage("آیدی کاربر الزامی است.")
    .isMongoId()
    .withMessage("آیدی کاربر نامعتبر است."),

  body("status")
    .optional()
    .isIn(["بررسی شده", "بررسی نشده"])
    .withMessage("وضعیت باید یکی از این دو مقدار باشد: بررسی شده یا بررسی نشده."),
];

module.exports = {
  createTaskValidator,
};
