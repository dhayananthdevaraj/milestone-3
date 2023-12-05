const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/login', userController.getUserByUsernameAndPassword);
router.post('/signup', userController.addUser);
router.get('/allUsers', userController.getAllUsers);

module.exports = router;
