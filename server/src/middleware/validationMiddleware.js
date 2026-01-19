const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
    }
    next();
};

const validateUser = [
    body('name')
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage('Name must be between 20 and 60 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be 8-16 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character (!@#$%^&*)'),
    body('address')
        .trim()
        .isLength({ max: 400 })
        .withMessage('Address must not exceed 400 characters'),
    validateRequest
];

const validateStore = [
    body('name').trim().notEmpty().withMessage('Store name is required'),
    body('email').trim().isEmail().withMessage('Invalid store email'),
    body('address').trim().notEmpty().withMessage('Store address is required'),
    validateRequest
];

const validateRating = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
    validateRequest
];

const validatePasswordChange = [
    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be 8-16 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character (!@#$%^&*)'),
    validateRequest
];

module.exports = {
    validateUser,
    validateStore,
    validateRating,
    validatePasswordChange
};
