const express = require('express');
const router = express.Router();
const { validateUser } = require('../middleware/validationMiddleware');
const authController = require('../controllers/authController');

router.post('/signup', validateUser, authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
