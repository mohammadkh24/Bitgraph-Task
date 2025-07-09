const Task = require("../../models/Task");
const Course = require("../../models/Course");
const User = require("../../models/User");
const {updateUserAverageAndLevel} = require("../../services/userStats")

exports.createTask = async (req, res) => {
  try {
    const { description, courseId } = req.body;
    const file = req.file;

    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).json({
        message: "دوره پیدا نشد",
      });
    }

    if (!file) {
      return res.status(400).json({ message: "فایل آپلود نشده است." });
    }

    const mediaUrlPath = `/tasks/${req.file.filename}`;

    const newTask = new Task({
      description,
      file: mediaUrlPath,
      courseId,
      userId: req.user._id,
    });

    await newTask.save();
    res.status(201).json({
      message: "تمرین ارسال شد",
      newTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطای سرور" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.courseId) {
      filter.courseId = req.query.courseId;
    }

    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .populate("courseId", "title")
      .populate("userId", "username")
      .populate("feedback")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      tasks,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطای سرور" });
  }
};

exports.getTasksForTeacher = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("courses role");
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }
    if (user.role !== "TEACHER") {
      return res.status(403).json({ message: "دسترسی غیرمجاز" });
    }

    // پارامترهای کوئری با مقدار پیش‌فرض
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "desc" ? -1 : 1;

    const filter = { courseId: { $in: user.courses } };
    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};


exports.getMyTasks = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const total = await Task.countDocuments({ userId: req.user._id });
  
      const tasks = await Task.find({ userId: req.user._id })
        .populate("courseId", "title")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      res.json({
        tasks,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "خطای سرور" });
    }
  };
  

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("courseId", "title")
      .populate("userId", "username")
      .populate("feedback" , "text");

    if (!task) {
      return res.status(404).json({ message: "تسک پیدا نشد." });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطای سرور" });
  }
};

exports.updateTaskStatus = async (req, res) => {
    try {
      const { status, score } = req.body;
  
      if (!["بررسی شده", "بررسی نشده"].includes(status)) {
        return res.status(400).json({ message: "وضعیت نامعتبر است." });
      }
  
      if (score !== undefined) {
        const parsedScore = parseFloat(score);
        if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 10) {
          return res.status(400).json({ message: "نمره باید عددی بین 1 تا 10 باشد." });
        }
      }
  
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { status, ...(score !== undefined && { score }) },
        { new: true }
      );
      await updateUserAverageAndLevel(task.userId);

  
      if (!task) {
        return res.status(404).json({ message: "تسک پیدا نشد." });
      }
  
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "خطای سرور" });
    }
  };
  
  exports.editTaskByUser = async (req, res) => {
    try {
      const taskId = req.params.id;
      const userId = req.user._id;  
  
      const task = await Task.findOne({ _id: taskId, userId });
  
      if (!task) {
        return res.status(404).json({ message: "تسک پیدا نشد یا دسترسی ندارید." });
      }
  
      const allowedUpdates = ["description"];
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          task[field] = req.body[field];
        }
      });
  
      
  
      await task.save();
  
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "خطای سرور" });
    }
  };
  