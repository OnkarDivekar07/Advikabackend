const { body, param } = require("express-validator");

// Validator for creating/updating a draft order
const validateDraftOrder = [
  body("selectedAddressId")
    .notEmpty().withMessage("Address ID is required")
    .isString().withMessage("Address ID must be a string")
    .isLength({ min: 10 }).withMessage("Address ID seems invalid"),
];

// Optional: Validator for :id param in GET /orders/:id
const validateOrderIdParam = [
  param("id")
    .notEmpty().withMessage("Order ID is required")
    .isString().withMessage("Order ID must be a string"),
];

module.exports = {
  validateDraftOrder,
  validateOrderIdParam,
};
