const axios = require("axios");

exports.sendSms = async (phone, otp) => {
  try {
    const response = await axios.post("http://ippanel.com/api/select", {
      op: "pattern",
      user: process.env.SMS_USERNAME,
      pass: process.env.SMS_PASSWORD,
      fromNum: process.env.SMS_FROM,
      toNum: phone,
      patternCode: process.env.VERIFY_PATTERN_CODE,
      inputData: [{ "verification-code": otp }],
    });

    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.response?.data || error.message);
    throw new Error("Failed to send SMS");
  }
};
