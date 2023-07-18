const { check } = require('express-validator')
const validatorMiddleware = require('./validatorMiddleware')
const userModel = require('../Models/userModel')

exports.createAddressValidatorRule = [
  check("title")
  .notEmpty().withMessage("adress title is required")
  .isLength({min: 2}).withMessage("title length must be at least 2 characters"),

  check("fullAddress")
  .notEmpty().withMessage("fullAddress is required")
  .isLength({min: 10}).withMessage("title length must be at least 10 characters"),

  check("phone")
  .notEmpty().withMessage("phone is required")
  .isMobilePhone(["ar-EG", "ar-SA"]).withMessage("phone format is inncorrect"),
  validatorMiddleware
]
exports.updateAddressValidatorRule = [
  check("title")
  .optional()
  .isLength({min: 2}).withMessage("title length must be at least 2 characters"),

  check("fullAddress")
  .optional()
  .isLength({min: 10}).withMessage("title length must be at least 10 characters"),

  check("phone")
  .optional()
  .isMobilePhone(["ar-EG", "ar-SA"]).withMessage("phone format is inncorrect"),
  validatorMiddleware
]

exports.deleteAddressValidatorRule = [
  check("id")
  .isMongoId().withMessage("invalid id")
  .custom(async id => {
    const document = await userModel.findOne({"addresses._id": id})
    if (!document) {
      throw new Error(`this id: ${id} is not address id or not found`)
    }
  }),
  validatorMiddleware
]