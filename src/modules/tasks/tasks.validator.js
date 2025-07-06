const { body } = require("express-validator");

const createTaskValidator = [
  body("description")
    .notEmpty()
    .withMessage("توضیحات الزامی است.")
    .isLength({ min: 3 })
    .withMessage("توضیحات باید حداقل3 حرف باشد."),

  body("status")
    .optional()
    .isIn(["بررسی شده", "بررسی نشده"])
    .withMessage("وضعیت باید یکی از این دو مقدار باشد: بررسی شده یا بررسی نشده."),

    body("score")
    .optional()
    .isFloat({ min: 1, max: 10 }).withMessage("نمره باید عددی بین 1 تا 10 باشد")
];

module.exports = {
  createTaskValidator,
};
