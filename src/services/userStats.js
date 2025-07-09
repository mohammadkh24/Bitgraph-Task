const User = require("../models/User");
const Task = require("../models/Task");

exports.updateUserAverageAndLevel = async (userId) => {
  const tasks = await Task.find({
    userId,
    status: "بررسی شده",
    score: { $ne: null },
  });

  if (!tasks.length) return;

  const total = tasks.reduce((sum, t) => sum + t.score, 0);
  const average = total / tasks.length;

  let level = "Beginner";
  if (average >= 7) level = "Advanced";
  else if (average >= 4) level = "Intermediate";

  await User.findByIdAndUpdate(userId, {
    averageScore: average,
    level: level,
  });
};
