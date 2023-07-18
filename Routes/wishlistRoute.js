const express = require('express')
const { protectRoute, allowedTo } = require('../Controllers/authController')
const { getWishlistForSpecificUserValidatorRule, deleteOneProductFromWishlistValidatorRule } = require('../Validators/wishlistValidatorRules')
const { createProductOnWishlist, getWishlistForSpecificUser, deleteOneProductFromWishlist } = require('../Controllers/wishlistController')

const wishlistRouter = express.Router()

wishlistRouter.use(protectRoute, allowedTo("user"))

wishlistRouter.post("/", getWishlistForSpecificUserValidatorRule, createProductOnWishlist)
wishlistRouter.get("/", getWishlistForSpecificUser)
wishlistRouter.delete("/:id", deleteOneProductFromWishlistValidatorRule, deleteOneProductFromWishlist)

module.exports = wishlistRouter