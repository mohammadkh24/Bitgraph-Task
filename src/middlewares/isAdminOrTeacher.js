module.exports = async (req, res, next) => {
    const isAdminOrTeacher = req.user.role === "ADMIN" || req.user.role === "TEACHER";
  
    if (isAdminOrTeacher) {
      return next();
    }
  
    res.status(403).json({
      message: "This route accessible only for admin and teacher",
    });
  };