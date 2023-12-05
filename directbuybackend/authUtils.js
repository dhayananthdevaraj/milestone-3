// authUtils.js

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, 'asdfghjkl', {
    expiresIn: '1h', // Adjust the expiration time as needed
  });
};

const validateToken = (req, res, next) => {
  try {
    console.log("came in auth",req);
    const token = req.header('Authorization');

    const decoded = jwt.verify(token, 'asdfghjkl');
    console.log("decoded",decoded);
    next()

  } catch (error) {
    console.log("error",error);
    res.status(400).json({ message:"Authentication failed" });
  }
};

module.exports = {
  generateToken,
  validateToken,
};
