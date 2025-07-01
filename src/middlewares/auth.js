const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "not providedToken !!",
      });
    }

    const tokenArray = token.split(" ");
    const tokenValue = tokenArray[1];

    if (tokenArray[0] !== "Bearer") {
      return res.status(401).json({
        message: "Write [Bearer ] at the start ot the token",
      });
    }

    const decoded = jwt.decode(tokenValue, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Token is not valid",
      });
    }

    const userId = decoded.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found!!",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
