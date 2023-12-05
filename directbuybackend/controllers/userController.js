const { generateToken } = require('../authUtils');
const User = require('../models/userModel');



const getUserByUsernameAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(" req.body", req.body);
    // Find a user with the given username and password
    const user = await User.findOne({ email, password })
    if (!user) {
      return res.status(200).json({ message: 'Invalid Credentials' });
    };
    const token = generateToken(user._id)
    console.log("token",token);
    

    res.status(200).json({"userInformation":user,"token":token});
  } catch (error) {
console.log("error",error);
    res.status(500).json({ message: error.message });
  }
};


const addUser = async (req, res) => {
  try {

    console.log("req.body in signup", req.body);
    const user = await User.create(req.body);
    res.status(200).json({ "message": "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserByUsernameAndPassword,
  addUser,
  getAllUsers
};



