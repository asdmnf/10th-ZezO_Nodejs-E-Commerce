const { check } = require('express-validator');

exports.createBrandValidatorRule = [
  check("name").notEmpty().withMessage("brand name is required")
  .isLength({min:2}).withMessage("brand name must be at least 2 characters")
  .isLength({max:32}).withMessage("brand name must be at most 32 characters")
]

exports.getSpecificBrandValidatorRule = [
  check("id").isMongoId().withMessage("Invalid id"),
]

exports.updateSpecificBrandValidatorRule = [
  check("id").isMongoId().withMessage("Invalid id"),
  check("name").notEmpty().withMessage("brand name is required")
  .isLength({min:2}).withMessage("brand name must be at least 2 characters")
  .isLength({max:32}).withMessage("brand name must be at most 32 characters")

]

exports.deleteSpecificBrandValidatorRule = [
  check("id").isMongoId().withMessage("Invalid id")
]
