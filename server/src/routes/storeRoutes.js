const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { validateStore, validateRating } = require('../middleware/validationMiddleware');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Public
router.get('/', authMiddleware, storeController.getStores);

// Normal User
router.post('/rating', authMiddleware, requireRole(['normal']), validateRating, storeController.submitRating);

// Admin
router.get('/stats', authMiddleware, requireRole(['admin']), storeController.getStats);
router.post('/', authMiddleware, requireRole(['admin']), validateStore, storeController.createStore);

// Store Owner
router.get('/dashboard', authMiddleware, requireRole(['store_owner']), storeController.getStoreDashboard);

module.exports = router;
