const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;


exports.generateToken = (email) => {
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: "1d" });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return error;
  }
};

