const { check } = require('express-validator')
const validatorMiddleware = require('./validatorMiddleware')

exports.createFeesValidation = [
  check("shippingFees")
  .notEmpty().withMessage("shippingFees must not be empty")
  .isNumeric().withMessage("shippingFees must be a number"),

  check("taxFeesPercentage")
  .notEmpty().withMessage("taxFeesPPercentage must not be empty")
  .isNumeric().withMessage("taxFeesPPercentage must be a number"),
  validatorMiddleware
]

exports.getSpecificFeesValidation = [
  check("id")
  .isMongoId().withMessage("invalid fees id"),
  validatorMiddleware
]

exports.updateSpecificFeesValidation = [
  check("id")
  .isMongoId().withMessage("invalid fees id"),

  check("shippingFees")
  .notEmpty().withMessage("shippingFees must not be empty")
  .isNumeric().withMessage("shippingFees must be a number"),

  check("taxFeesPercentage")
  .notEmpty().withMessage("taxFeesPPercentage must not be empty")
  .isNumeric().withMessage("taxFeesPPercentage must be a number"),
  validatorMiddleware
]

exports.deleteSpecificFeesValidation = [
  check("id")
  .isMongoId().withMessage("invalid fees id"),
  validatorMiddleware
]