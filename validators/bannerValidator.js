const { body } = require('express-validator');

exports.createBannerValidator = [
  body('linkUrl')
    .optional()
    .isURL().withMessage('linkUrl must be a valid URL'),
];
