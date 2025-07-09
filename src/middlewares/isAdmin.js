module.exports = async (req, res, next) => {
    const isManager = req.user.role === "MANAGER";
  
    if (isManager) {
      return next();
    }
  
    res.status(403).json({
      message: "This route accessible only for manager",
    });
  };