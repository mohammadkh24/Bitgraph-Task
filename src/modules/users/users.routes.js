const express = require("express");
const controller = require("./users.controller");
const { auth } = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");
const isAdminOrTeacher = require("../../middlewares/isAdminOrTeacher");
const multer = require("multer");
const validate = require("../../middlewares/validate");
const {roleValidator} = require("./users.validator")
const upload = require("../../utils/uploader");

const router = express.Router();

router
  .route("/")
  .get(auth, isAdmin, controller.getAll)
  .patch(auth ,upload.single("avatar"), controller.edit);

router.route("/:userId").delete(auth, isAdmin, controller.remove).get(auth , isAdmin , controller.getOne);

router.route("/phone/:phone").get(auth, isAdminOrTeacher , controller.getOneByPhone)

router.route("/:userId/set-teacher").put(auth, isAdmin,controller.setTeacher);

router.route("/:userId/role").put(auth, isAdmin, roleValidator , validate,controller.changeRole);

module.exports = router;
