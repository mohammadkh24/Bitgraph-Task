module.exports = async (req, res, next) => {
    const isTeacher = req.user.role === "TEACHER";
  
    if (isTeacher) {
      return next();
    }
  
    res.status(403).json({
      message: "This route accessible only for teacher",
    });
  };