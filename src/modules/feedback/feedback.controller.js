const Feedback = require("../../models/Feedback");
const Task = require("../../models/Task");

exports.createFeedback = async (req, res) => {
  try {
    const { taskId, text } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "تسک پیدا نشد." });
    }

    const feedback = new Feedback({
      text,
      taskId,
      teacherId: req.user._id,
    });

    await feedback.save();

    // اتصال بازخورد به تسک
    task.feedback = feedback._id;
    await task.save();

    res.status(201).json({
      message: "بازخورد ثبت شد.",
      feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطای سرور." });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { text } = req.body;
    const feedbackId = req.params.id;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "بازخورد پیدا نشد." });
    }

    feedback.text = text;
    await feedback.save();

    res.json({
      message: "بازخورد ویرایش شد.",
      feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطای سرور." });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;

    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "بازخورد پیدا نشد." });
    }

    // حذف ارتباط از تسک
    await Task.findOneAndUpdate({ feedback: feedbackId }, { $unset: { feedback: "" } });

    res.json({ message: "بازخورد حذف شد." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطای سرور." });
  }
};
