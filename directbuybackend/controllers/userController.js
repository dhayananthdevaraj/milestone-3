const User = require('../models/userModel');



const getUserByUsernameAndPassword = async (req, res) => {
  try {
    const { username, password } = req.body;
     console.log(" req.body", req.body);
    // Find a user with the given username and password
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addUser = async (req, res) => {
  try {
    
    console.log("req.body in signup",req.body);
    const user = await User.create(req.body);
    res.status(200).json({"message":"Success"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserByUsernameAndPassword,
  addUser
};



