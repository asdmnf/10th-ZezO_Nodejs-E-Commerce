const { check } = require('express-validator')
const validatorMiddleware = require('./validatorMiddleware')
const wishlistModel = require('../Models/wishlistModel')
const productModel = require('../Models/productModel')

exports.getWishlistForSpecificUserValidatorRule = [
  check("product")
  .isMongoId().withMessage("invalid id")
  .custom(async id => {
    const document = await productModel.findById(id)
    if (!document) {
      throw new Error("Product not found check product id")
    }
    return true
  })
  .custom(async (id, {req}) => {
    const document = await wishlistModel.findOne({
      user : req.user._id,
      product: id
    })
    if (document) {
      throw new Error("you cannot wishlist the same product twice")
    }
    return true
  }),
  validatorMiddleware
]

exports.deleteOneProductFromWishlistValidatorRule = [
  check("id")
  .isMongoId().withMessage("invalid id"),
  validatorMiddleware
]