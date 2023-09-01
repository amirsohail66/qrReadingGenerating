const { body, validationResult } = require('express-validator');

exports.validateAdminSignupInput = [
    body('email')
        .trim() 
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

    body('role')
        .trim()
        .isIn(['admin', 'superadmin'])
        .withMessage('Role should be either "admin" or "superadmin"')
];

exports.validateUserSignupInput = [
    body('name')
        .trim()
        .isAlpha()
        // .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name can only contain alphabetic characters'),

    body('email')
        .trim() 
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

    body('address')
        .trim()
        .isLength({ min: 4, max: 255 })
        .withMessage('Address is required and should be less than 255 characters')
];
//for reading qrText
exports.validateInput = [
    body('qrText')
        .trim()
        .isString()
        .not().isEmpty()
        .withMessage('qrText is required')
];

exports.validateLoginInput = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
];

exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};