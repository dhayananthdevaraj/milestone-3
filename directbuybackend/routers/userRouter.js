const express = require('express');
const userController = require('../controllers/userController');
const { validateToken } = require('../authUtils');
const router = express.Router();

router.post('/login', userController.getUserByUsernameAndPassword);
router.post('/signup', userController.addUser);
router.get('/getAllUsers',validateToken, userController.getAllUsers);

module.exports = router;
