const { isValidObjectId } = require("mongoose");
const User = require("../../models/User");
const Course = require("../../models/Course");
const Task = require("../../models/Task");
const { createPaginationData } = require("../../utils/pagination");

exports.getAll = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    const users = await User.find({})
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      users,
      pagination: createPaginationData(page, limit, totalUsers, "Users"),
    });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        message: "شما فقط می‌توانید حساب خودتان را حذف کنید.",
      });
    }

    const removedUser = await User.findByIdAndDelete(userId);

    if (!removedUser) {
      return res.status(404).json({
        message: "کاربری با این مشخصات یافت نشد.",
      });
    }

    return res.status(200).json({
      message: "حساب کاربری با موفقیت حذف شد.",
      user: removedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "شناسه کاربر معتبر نیست.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "کاربر یافت نشد.",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOneByPhone = async (req, res, next) => {
  try {
    const { phone } = req.params;

    const user = await User.findOne({phone});

    if (!user) {
      return res.status(404).json({
        message: "کاربر یافت نشد.",
      });
    }

    const tasks = await Task.find({userId : user._id});

    const tasksCount = tasks.length;

    return res.status(200).json({
      user,
      tasksCount
    });
  } catch (error) {
    next(error);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "شناسه کاربر معتبر نیست.",
      });
    }

    
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },           
        { role: role },        
        { new: true }              
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        message: "کاربر یافت نشد.",
      });
    }

    return res.status(200).json({
      message: "نقش کاربر با موفقیت تغییر یافت.",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { address, username } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "کاربر یافت نشد.",
      });
    }

    const mediaUrlPath = `/images/${req.file.filename}`;

    user.address = address || user.address;
    user.avatar = mediaUrlPath || user.avatar;
    user.username = username || user.username;

    const editUser = await user.save();

    return res.status(200).json({
      message: "اطلاعات کاربر با موفقیت به‌روزرسانی شد.",
      user: editUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.setTeacher = async (req,res,next) => {
  const {userId} = req.params;
  const {courseIds} = req.body;

  if (!courseIds) {
    return res.status(400).json({
      message : "لطفا آیدی دوره های مدرس را وارد کنید"
    })
  }

  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      message : "آیدی کاربر معتبر نیست"
    })
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "کاربر یافت نشد." });
  }
 

  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    return res.status(400).json({ message: "لیست دوره‌ها نامعتبر است." });
  }

  const invalidIds = courseIds.filter(id => !isValidObjectId(id));
  if (invalidIds.length > 0) {
    return res.status(400).json({ message: "یک یا چند آیدی دوره نامعتبر است." });
  }

  const foundCourses = await Course.find({ _id: { $in: courseIds } });

  if (foundCourses.length !== courseIds.length) {
    return res.status(404).json({ message: "یک یا چند دوره پیدا نشد." });

  }
  
  
  // اضافه کردن آیدی‌هایی که قبلاً نبودن
  const newCourses = courseIds.filter(
    id => !user.courses.map(String).includes(String(id))
  );


  
  user.courses.push(...newCourses);
  user.role = "TEACHER";

  await user.save();

  return res.status(200).json({
    message : "نقش کاربر به مدرس تغییر یافت"
  })
}
