const { body, validationResult } = require('express-validator');

exports.validateUploadImageFields = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),
];

exports.validateShareImageEmail = [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email address'),
  ];

exports.validateUserSignupInput = [
    body('name').notEmpty().withMessage('name is required')
        .trim()
        .isAlpha()
        .withMessage('Name can only contain alphabetic characters'),

    body('email').notEmpty().withMessage('email is required')
        .trim()
        .isEmail()
        .withMessage('Invalid email format'),

    body('password').notEmpty().withMessage('password is required')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

    body('address').notEmpty().withMessage('address is required')
        .trim()
        .isLength({ min: 4, max: 255 }),
];

exports.validateQrInput = [
    body('qrText')
        .trim()
        .isString()
        .not().isEmpty()
        .withMessage('qrText is required')
];

exports.validateLoginInput = [
    body('email').notEmpty.apply().withMessage('email is required')
        .trim()
        .isEmail()
        .withMessage('Invalid email format'),

    body('password').notEmpty().withMessage('password is required')
        .trim()
];

exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
