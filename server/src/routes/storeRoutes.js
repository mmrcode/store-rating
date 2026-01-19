const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { validateStore, validateRating } = require('../middleware/validationMiddleware');

// Public
router.get('/', authMiddleware.authMiddleware, storeController.getStores);

// Normal User
router.post('/rating', authMiddleware.authMiddleware, authMiddleware.requireRole(['normal']), validateRating, storeController.submitRating);

// Admin
router.get('/stats', authMiddleware.authMiddleware, authMiddleware.requireRole(['admin']), storeController.getStats);
router.post('/', authMiddleware.authMiddleware, authMiddleware.requireRole(['admin']), validateStore, storeController.createStore);

// Store Owner
router.get('/dashboard', authMiddleware.authMiddleware, authMiddleware.requireRole(['store_owner']), storeController.getStoreDashboard);

module.exports = router;
