const { check } = require('express-validator')
const userModel = require('../Models/userModel')
const validatorMiddleware = require('./validatorMiddleware')
const bcrypt = require('bcryptjs')

// admin

exports.createUserValidatorRule = [
  check("name")
  .notEmpty().withMessage("name is required")
  .isLength({min: 2}).withMessage("name must be at least 2 characters"),

  check("email")
  .notEmpty().withMessage("email is required")
  .isEmail().withMessage("email format is incorrect") 
  .custom(async (value) => { 
    await userModel.findOne({email: value}).then(email => { 
      if (email) {
        return Promise.reject(new Error(`email:${value} is already in use`));
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
        return Promise.reject(new Error(`this phone: ${value} is already in use`))
      }
      return true
    })
  }),

  check("userImage")
  .optional(),

  check("role").optional() 
  .custom(value => {
    if (value === "admin" || value ==="user") { 
      return true
    } else {
      throw new Error("role must be only admin or user") 
    }
  }),
  validatorMiddleware
]

exports.getSpecificUserValidatorRule = [
  check("id")
  .isMongoId().withMessage("invalid id"),
  validatorMiddleware
]

// change data
exports.updateSpecificUserValidatorRule = [
  check("id")
  .isMongoId().withMessage("invalid id"),

  check("name").optional()
  .isLength({min: 2}).withMessage("name must be at least 2 characters"),

  check("email").optional()
  .isEmail().withMessage("email format is incorrect")
  .custom(async (value) => {
    await userModel.findOne({email: value}).then(email => { 
      if (email) {
        return Promise.reject(new Error(`email:${value} is already in use`));
      }
      return true
    })
  }),

  check("password").optional()
  .isEmpty().withMessage("you cannot change password field from here") 
  .custom(value => { 
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change password field from here")
    }
  }),

  check("passwordChangedAt").optional() 
  .isEmpty().withMessage("you cannot change passwordChangedAt field from here")
  .custom(value => {
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change passwordChangedAt field from here")
    }
  }),

  check("phone")
  .optional()
  .isMobilePhone(["ar-EG", "ar-SA"]).withMessage("phone ust be EGY or KSA numbers")
  .custom(async value => {
    await userModel.findOne({phone: value}).then(phone => {
      if (phone) {
        return Promise.reject(new Error(`this phone: ${value} is already in use`))
      }
      return true
    })
  }),

  check("userImage")
  .optional(),

  check("role").optional()
  .custom(value => {
    if (value === "admin" || value ==="user") {
      return true
    } else {
      throw new Error("role must be only admin or user")
    }
  }),

  check("passwordResetCode").optional()
  .isEmpty().withMessage("you cannot change passwordResetCode field from here")
  .custom(value => {
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change passwordResetCode field from here")
    }
  }),

  check("passwordResetCodeExpiration").optional()
  .isEmpty().withMessage("you cannot change passwordResetCodeExpiration field from here")
  .custom(value => {
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change passwordResetCodeExpiration field from here")
    }
  }),

  check("passwordResetCodeVerifiedStatus").optional()
  .isEmpty().withMessage("you cannot change passwordResetCodeVerifiedStatus field from here")
  .custom(value => {
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change passwordResetCodeVerifiedStatus field from here")
    }
  }),
  validatorMiddleware
]

// change password
exports.changeUserPasswordValidatorRule = [
  check("id")
  .isMongoId().withMessage("invalid id"),

  check("oldPassword") 
  .notEmpty().withMessage("oldPassword is required"),

  check("password") 
  .notEmpty().withMessage("password is required")
  .isLength({min: 6}).withMessage("password must be at least 6 chars/symbols")
  .custom(async (value, {req}) => {
    const document = await userModel.findById(req.params.id) 
    if (!document) { 
      throw new Error("there is no such user for this id") 
    }
    const comparePasswords = await bcrypt.compare(req.body.oldPassword, document.password) 
    if (!comparePasswords) { 
      throw new Error("old password is incorrect")
    }
    return true 
  }),

  check("passwordConfirmation") 
  .notEmpty().withMessage("password confirmation is required")
  .custom((value, {req}) => {
    if (req.body.password !== value) {
      throw new Error("password confirmation is wrong")
    }
    return true
  }),
  validatorMiddleware
]

exports.deleteSpecificUserValidatorRule = [
  check("id")
  .isMongoId().withMessage("invalid id"),
  validatorMiddleware
]


// user

exports.updateLoggedUserDataValidatorRule = [
  check("name").optional()
  .isLength({min: 2}).withMessage("name must be at least 2 characters"),

  check("email").optional()
  .isEmail().withMessage("email format is incorrect")
  .custom(async (value) => { 
    await userModel.findOne({email: value}).then(document => {
      if (document) {
        return Promise.reject(new Error(`email already in use`));
      }
      return true
    })
  }),

  check("password").optional() 
  .isEmpty().withMessage("you cannot change password field from here") 
  .custom(value => { 
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change password field from here")
    }
  }),


  check("passwordChangedAt").optional() 
  .isEmpty().withMessage("you cannot change passwordChangedAt field from here")
  .custom(value => {
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change passwordChangedAt field from here")
    }
  }),

  check("phone")
  .optional()
  .isMobilePhone(["ar-EG", "ar-SA"]).withMessage("phone must be EGY or KSA numbers")
  .custom(async value => {
    await userModel.findOne({phone: value}).then(document => {
      if (document) {
        return Promise.reject(new Error(`this phone is already in use`))
      }
      return true
    })
  }),

  check("userImage")
  .optional(),

  check("role").optional() 
  .isEmpty().withMessage("you cannot change role field from here")
  .custom(value => {
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change role field from here")
    }
  }),

  check("active").optional() 
  .isEmpty().withMessage("you cannot change active field from here"),


  check("passwordResetCode").optional()
  .isEmpty().withMessage("you cannot change passwordResetCode field from here")
  .custom(value => {
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change passwordResetCode field from here")
    }
  }),

  check("passwordResetCodeExpiration").optional()
  .isEmpty().withMessage("you cannot change passwordResetCodeExpiration field from here")
  .custom(value => {
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change passwordResetCodeExpiration field from here")
    }
  }),

  check("passwordResetCodeVerifiedStatus").optional()
  .isEmpty().withMessage("you cannot change passwordResetCodeVerifiedStatus field from here")
  .custom(value => {
    if (value === "") {
      throw new Error("empty values are not allowed and you cannot change passwordResetCodeVerifiedStatus field from here")
    }
  }),


  validatorMiddleware
]


exports.updateLoggedUserPasswordValidatorRule = [
  check("oldPassword")
  .notEmpty().withMessage("oldPassword is required"),

  check("password")
  .notEmpty().withMessage("password is required")
  .isLength({min: 6}).withMessage("password must be at least 6 chars/symbols")
  .custom(async (value, {req}) => { 
    const document = await userModel.findById(req.user._id) 
    if (!document) {
      throw new Error("there is no such user for this id")
    }
    const comparePasswords = await bcrypt.compare(req.body.oldPassword, document.password)
    if (!comparePasswords) {
      throw new Error("old password is incorrect")
    }
    return true
  }),

  check("passwordConfirmation") 
  .notEmpty().withMessage("password confirmation is required")
  .custom((value, {req}) => {
    if (req.body.password !== value) {
      throw new Error("password confirmation is wrong")
    }
    return true
  }),
  validatorMiddleware
]