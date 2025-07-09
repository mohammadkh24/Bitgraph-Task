const Course = require("../../models/Course");
const User = require("../../models/User");

exports.createCourse = async (req, res, next) => {
  try {
    const { title,englishTitle ,teacherId } = req.body;

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "TEACHER") {
      return res.status(400).json({ message: "مدرس معتبر یافت نشد یا نقش اشتباه است." });
    }

    const newCourse = new Course({ title,englishTitle ,teacherId });
    await newCourse.save();
    res.status(201).json({ message: "دوره با موفقیت ایجاد شد.", course: newCourse });
  } catch (error) {
    next(error);
  }
};
exports.getAllCourses = async (req, res, next) => {
    try {
      const { title } = req.query;
  
      const filter = title
        ? { title: { $regex: title, $options: "i" } }
        : {};
  
      const courses = await Course.find(filter).populate("teacherId" , "username")
      res.status(200).json({ courses });
    } catch (error) {
      next(error);
    }
  };
  

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("teacherId" , "username")
    if (!course) return res.status(404).json({ message: "دوره یافت نشد." });
    res.status(200).json({ course });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const { title } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "دوره یافت نشد." });

    course.title = title || course.title;
    await course.save();

    res.status(200).json({ message: "دوره با موفقیت به‌روزرسانی شد.", course });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "دوره یافت نشد." });
    res.status(200).json({ message: "دوره با موفقیت حذف شد.", course });
  } catch (error) {
    next(error);
  }
};
