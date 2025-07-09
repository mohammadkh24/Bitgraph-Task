const redis = require("../../../redis");
const bcrypt = require("bcrypt");
const { sendSms } = require("../../services/otp");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

//* Start Helper functions

function getOtpRedisPattern(phone) {
  return `otp:${phone}`;
}

async function getOtpDetails(phone) {
  const otp = await redis.get(getOtpRedisPattern(phone));
  if (!otp) {
    return {
      expired: true,
      remainingTime: 0,
    };
  }

  const remainingTime = await redis.ttl(getOtpRedisPattern(phone)); // Second
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60; // "01:20"
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    expired: false,
    remainingTime: formattedTime,
  };
}

const generateOtp = async (phone, length = 4, expireTime = 1) => {
  const digist = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digist[Math.floor(Math.random() * digist.length)];
  }

  //! Temporary
  //   otp = "1111";

  const hashedOtp = await bcrypt.hash(otp, 12);

  await redis.set(getOtpRedisPattern(phone), hashedOtp, "EX", expireTime * 60);

  return otp;
};

//* Finish Helper functions

exports.send = async (req, res, next) => {
    try {
      const { phone } = req.body;
  
      const { expired, remainingTime } = await getOtpDetails(phone);
  
      if (!expired) {
        return res.status(200).json({
          message: `کد قبلاً ارسال شده، لطفاً بعد از ${remainingTime} دوباره تلاش کنید`,
        });
      }
  
      const otp = await generateOtp(phone);
  
      await sendSms(phone, otp);
  
      return res.status(200).json({
        message: "کد تأیید با موفقیت ارسال شد",
        otp
      });
    } catch (err) {
      next(err);
    }
  };
  
  exports.verify = async (req, res, next) => {
    try {
      const { phone, otp } = req.body;
  
      const savedOtp = await redis.get(getOtpRedisPattern(phone));
  
      if (!savedOtp) {
        return res.status(400).json({
          message: "کد نادرست یا منقضی شده است!",
        });
      }
  
      const otpIsCorrect = await bcrypt.compare(otp, savedOtp);
  
      if (!otpIsCorrect) {
        return res.status(400).json({
          message: "کد نادرست یا منقضی شده است!",
        });
      }
  
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        const token = jwt.sign(
          { userId: existingUser._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
  
        return res.status(200).json({
          user: existingUser,
          token,
          message: "ورود با موفقیت انجام شد",
        });
      }
  
      const isFirstUser = (await User.countDocuments()) === 0;
  
      const user = await User.create({
        phone,
        username: phone,
        role: isFirstUser ? "MANAGER" : "STUDENT",
      });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
  
      return res.status(201).json({
        message: "کاربر با موفقیت ثبت‌نام شد ",
        user,
        token,
      });
    } catch (err) {
      next(err);
    }
  };
  

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
