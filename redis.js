const { Redis } = require("ioredis");

const redis = new Redis(process.env.Redis_URI);

module.exports = redis;
