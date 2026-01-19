const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Admin routes
router.get('/', requireRole(['admin']), userController.getUsers);
router.post('/', requireRole(['admin']), userController.createUser); // Admin adds users
router.get('/:id', requireRole(['admin']), userController.getUserDetails);

// Common routes
router.put('/password', userController.updatePassword);

module.exports = router;
