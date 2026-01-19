const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validatePasswordChange } = require('../middleware/validationMiddleware');

const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Admin routes
router.get('/', requireRole(['admin']), userController.getUsers);
router.post('/', requireRole(['admin']), validateUser, userController.createUser); // Admin adds users
router.get('/:id', requireRole(['admin']), userController.getUserDetails);

// Common routes
router.put('/password', validatePasswordChange, userController.updatePassword);

module.exports = router;
