const { check } = require('express-validator')
const validatorMiddleware = require('./validatorMiddleware')
const productModel = require('../Models/productModel')
const couponModel = require('../Models/couponModel')

exports.createCartValidatorRule = [
  check("product")
  .notEmpty().withMessage("product id is required")
  .isMongoId().withMessage("invalid id")
  .custom(async id => {
    const document = await productModel.findById(id)
    if (!document) {
      throw new Error("product not found")
    }
    return true
  }),

  check("quantity")
  .notEmpty().withMessage("product quantity is required")
  .isNumeric().withMessage("product quantity must be a number")
  .isInt().withMessage("product quantity must be integer"),
  validatorMiddleware
]

exports.deleteSpecificProductFromCartValidatorRule = [
  check("cartItemID")
  .isMongoId().withMessage("invalid cartItemID"),
  validatorMiddleware
]

exports.updateCartItemQuantityValidatorRule = [
  check("cartItemID")
  .isMongoId().withMessage("invalid cartItemID"),
  
  check("quantity")
  .notEmpty().withMessage("product quantity is required")
  .isNumeric().withMessage("product quantity must be a number")
  .isInt().withMessage("product quantity must be integer"),
  validatorMiddleware
]

exports.applyCouponOnCartValidatorRule = [
  check("name")
  .notEmpty().withMessage("product quantity is required")
  .toUpperCase()
  .custom(async value => {
    const couponDocument = await couponModel.findOne({name: value})
    if (!couponDocument) { 
      throw new Error("coupon not found check coupon name")
    }
    if (couponDocument.expireDate.getTime() <= Date.now()) { 

      throw new Error("coupon expired")
    }
    return true
  }),
  validatorMiddleware
]
