const { check } = require('express-validator')
const validatorMiddleware = require('./validatorMiddleware')
const cartModel = require('../Models/cartModel')
const userModel = require('../Models/userModel')


exports.createOrderValidation = [
  check("cartID")
  .isMongoId().withMessage("Invalid cartID")
  .custom(async (id, {req}) => {
    const cartDocument = await cartModel.findOne({_id: id, user: req.user._id})
    if (!cartDocument) {
      throw new Error("no cart found for this user check cartID")
    }
    return true
  }),

  check("shippingAddress")
  .isMongoId().withMessage("Invalid shippingAddress id")
  .custom(async (id, {req}) => { 
    const userDocument = await userModel.findById(req.user._id) 
    if (!userDocument.addresses?.length) { 
      throw new Error("user doesn't have any addresses yet please add one to use it here")
    } else { 
      const address = userDocument.addresses.filter(item => {
        return item._id.toString() === id
      })
      if (!address.length) { 
        throw new Error("this address id in not belong to this user")
      }
    }
    return true
  }),
  validatorMiddleware
]

exports.getSpecificOrderValidation = [
  check("orderID")
  .isMongoId().withMessage("Invalid orderID id"),
  validatorMiddleware
]

exports.updateIsDeliveredStatusValidation = [
  check("orderID")
  .isMongoId().withMessage("Invalid orderID"),
  validatorMiddleware
]

exports.updateIsPaidStatusValidation = [
  check("orderID")
  .isMongoId().withMessage("Invalid orderID"),
  validatorMiddleware
]

exports.deleteSpecificOrderValidation = [
  check("orderID")
  .isMongoId().withMessage("Invalid orderID"),
  validatorMiddleware
]

exports.stripeSessionValidation = [
  
  check("cartID")
  .isMongoId().withMessage("Invalid cartID")
  .custom(async (id, {req}) => {
    const cartDocument = await cartModel.findOne({_id: id, user: req.user._id})
    if (!cartDocument) {
      throw new Error("no cart found for this user check cartID")
    }
    return true
  }),

  check("shippingAddress")
  .isMongoId().withMessage("Invalid shippingAddress id")
  .custom(async (id, {req}) => {
    const userDocument = await userModel.findById(req.user._id)
    if (!userDocument.addresses?.length) { 
      throw new Error("user doesn't have any addresses yet please add one to use it here")
    } else { 
      const address = userDocument.addresses.filter(item => {
        return item._id.toString() === id
      })
      if (!address.length) { 
        throw new Error("this address id in not belong to this user")
      }
    }
    return true
  }),
  validatorMiddleware
]