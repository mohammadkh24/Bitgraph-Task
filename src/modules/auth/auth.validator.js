const { body } = require("express-validator");

const sentOtpValidator = [
  body("phone")
    .notEmpty()
    .withMessage("شماره موبایل الزامی است.")
    .isString()
    .withMessage("شماره موبایل باید به صورت رشته وارد شود.")
    .isLength({ min: 11, max: 11 })
    .withMessage("شماره موبایل باید ۱۱ رقم باشد.")
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage("فرمت شماره موبایل نامعتبر است."),
];

const otpVerifyValidator = [
  body("phone")
    .notEmpty()
    .withMessage("شماره موبایل الزامی است.")
    .isString()
    .withMessage("شماره موبایل باید به صورت رشته وارد شود.")
    .isLength({ min: 11, max: 11 })
    .withMessage("شماره موبایل باید ۱۱ رقم باشد.")
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage("فرمت شماره موبایل نامعتبر است."),

  body("otp")
    .notEmpty()
    .withMessage("کد تأیید الزامی است.")
    .isString()
    .withMessage("کد تأیید باید به صورت رشته وارد شود."),
];

module.exports = { sentOtpValidator, otpVerifyValidator };
