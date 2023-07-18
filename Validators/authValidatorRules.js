const { check } = require('express-validator');
const userModel = require('../Models/userModel');
const validatorMiddleware = require('./validatorMiddleware');


exports.signUpAuthValidatorRule = [
  check("name")
  .notEmpty().withMessage("name is required")
  .isLength({min: 2}).withMessage("name must be at least 2 characters"),

  check("email")
  .notEmpty().withMessage("email is required")
  .isEmail().withMessage("email format is incorrect")
  .custom(async (value) => {
    await userModel.findOne({email: value}).then(email => { 
      if (email) {
        return Promise.reject(new Error(`email is already in use`));
      }
      return true
    })
  }),

  check("password")
  .notEmpty().withMessage("password is required")
  .isLength({min: 6}).withMessage("password must be at least 6 chars/symbols"),

  check("passwordConfirmation")
  .notEmpty().withMessage("password confirmation is required")
  .custom((value, {req}) => {
    if (req.body.password !== value) {
      throw new Error("password confirmation is wrong")
    }
    return true
  }),

  check("phone")
  .optional()
  .isMobilePhone(["ar-EG", "ar-SA"]).withMessage("phone ust be EGY or KSA numbers")
  .custom(async value => {
    await userModel.findOne({phone: value}).then(phone => {
      if (phone) {
        return Promise.reject(new Error(`this phone is already in use`))
      }
      return true
    })
  }),
  validatorMiddleware
]

exports.logInAuthValidatorRule = [
  check("email")
  .notEmpty().withMessage("email is required")
  .isEmail().withMessage("email format is incorrect"),

  check("password")
  .notEmpty().withMessage("password is required")
  .isLength({min: 6}).withMessage("password must be at least 6 chars/symbols"),
  validatorMiddleware
]

exports.forgotPasswordValidatorRule = [
  check("email")
  .notEmpty().withMessage("email is required")
  .isEmail().withMessage("email format is incorrect"),
  validatorMiddleware
]

exports.verifyResetCodeValidatorRule = [
  check("email")
  .notEmpty().withMessage("email is required")
  .isEmail().withMessage("email format is incorrect"),

  check("resetCode")
  .notEmpty().withMessage("resetCode is required")
  .custom(value => {
    if (value.length !== 6) {
      throw new Error("resetCode length must be 6 numbers")
    }
    return true
  }),
  validatorMiddleware
]

exports.setNewPasswordValidatorRule = [
  check("email")
  .notEmpty().withMessage("email is required")
  .isEmail().withMessage("email format is incorrect"),

  check("newPassword")
  .notEmpty().withMessage("password is required")
  .isLength({min: 6}).withMessage("password must be at least 6 chars/symbols"),

  check("newPasswordConfirmation")
  .notEmpty().withMessage("password confirmation is required")
  .custom((value, {req}) => {
    if (req.body.newPassword !== value) {
      throw new Error("password confirmation is wrong")
    }
    return true
  }),
  validatorMiddleware
]