const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', authMiddleware.authMiddleware, storeController.getStores);

// Normal User
router.post('/rating', authMiddleware.authMiddleware, authMiddleware.requireRole(['normal']), storeController.submitRating);

// Admin
router.get('/stats', authMiddleware.authMiddleware, authMiddleware.requireRole(['admin']), storeController.getStats);
router.post('/', authMiddleware.authMiddleware, authMiddleware.requireRole(['admin']), storeController.createStore);

// Store Owner
router.get('/dashboard', authMiddleware.authMiddleware, authMiddleware.requireRole(['store_owner']), storeController.getStoreDashboard);

module.exports = router;
