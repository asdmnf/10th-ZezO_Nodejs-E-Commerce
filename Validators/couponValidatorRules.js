const { check } = require('express-validator')
const validatorMiddleware = require('./validatorMiddleware')
const couponModel = require('../Models/couponModel')

exports.createCouponValidatorRule = [
  check("name")
  .notEmpty().withMessage("coupon name is required")
  .toUpperCase() 
  .custom(async value => {
    const document = await couponModel.findOne({ name: value})
    if (document) {
      throw new Error(`found already try another name`)
    }
    return true
  }), 

  check("discountPercentage")
  .notEmpty().withMessage("discountPercentage is required")
  .isNumeric().withMessage("discountPercentage must be a number"),

  check("maxDiscount")
  .optional()
  .isNumeric().withMessage("maxDiscount must be a number"),

  check("expireDate")
  .notEmpty().withMessage("expireDate is required")

  ,
  validatorMiddleware
]

exports.getSpecificCouponValidatorRule = [
  check("id")
  .isMongoId().withMessage("invalid id"),
  validatorMiddleware
]
exports.updateSpecificCouponValidatorRule = [
  check("id")
  .isMongoId().withMessage("invalid id"),

  check("name")
  .optional()
  .toUpperCase() 
  .custom(async value => {
    const document = await couponModel.findOne({ name: value})
    if (document) {
      throw new Error(`found already try another name`)
    }
    return true
  }), 

  check("discountPercentage")
  .optional()
  .isNumeric().withMessage("discountPercentage must be a number"),

  check("maxDiscount")
  .optional()
  .isNumeric().withMessage("maxDiscount must be a number"),

  check("expireDate")
  .optional()

  ,
  validatorMiddleware
]
exports.deleteSpecificcouponValidatorRule = [
  check("id")
  .isMongoId().withMessage("invalid id"),
  validatorMiddleware
]