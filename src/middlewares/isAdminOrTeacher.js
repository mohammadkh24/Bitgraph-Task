module.exports = async (req, res, next) => {
    const isManagerOrTeacher = req.user.role === "MANAGER" || req.user.role === "TEACHER";
  
    if (isManagerOrTeacher) {
      return next();
    }
  
    res.status(403).json({
      message: "This route accessible only for manager and teacher",
    });
  };