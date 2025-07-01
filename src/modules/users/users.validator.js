const { body } = require("express-validator");

const roleValidator = [
  body("role")
    .notEmpty()
    .withMessage("فیلد نقش کاربر الزامی است.")
    .isString()
    .withMessage("نقش باید به صورت رشته باشد.")
    .isIn(["ADMIN", "USER", "TEACHER"])
    .withMessage("نقش باید یکی از موارد 'ADMIN', 'USER' یا 'TEACHER' باشد."),
];

module.exports = { roleValidator };
