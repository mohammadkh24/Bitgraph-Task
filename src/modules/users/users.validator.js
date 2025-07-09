const { body } = require("express-validator");

const roleValidator = [
  body("role")
    .notEmpty()
    .withMessage("فیلد نقش کاربر الزامی است.")
    .isString()
    .withMessage("نقش باید به صورت رشته باشد.")
    .isIn(["MANAGER", "STUDENT", "TEACHER"])
    .withMessage("نقش باید یکی از موارد 'MANAGER', 'STUDENT' یا 'TEACHER' باشد."),
];

module.exports = { roleValidator };
