const express = require('express');
const router = express.Router();
const { validateUser } = require('../middleware/validationMiddleware');

router.post('/signup', validateUser, authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
