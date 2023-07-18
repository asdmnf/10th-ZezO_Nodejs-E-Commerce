const express = require('express')
const { protectRoute, allowedTo } = require('../Controllers/authController')
const { createCart, getLoggedUserCart, deleteSpecificProductFromCart, clearLoggedUserCart, updateCartItemQuantity, applyCouponOnCart } = require('../Controllers/cartController')
const { createCartValidatorRule, deleteSpecificProductFromCartValidatorRule, updateCartItemQuantityValidatorRule, applyCouponOnCartValidatorRule } = require('../Validators/cartValidatorRules')

const cartRouter = express.Router()

cartRouter.use(protectRoute, allowedTo("user"))

cartRouter.post("/", createCartValidatorRule, createCart)
cartRouter.get("/", getLoggedUserCart)
cartRouter.delete("/:cartItemID", deleteSpecificProductFromCartValidatorRule, deleteSpecificProductFromCart)
cartRouter.delete("/", clearLoggedUserCart)
cartRouter.put("/:cartItemID", updateCartItemQuantityValidatorRule, updateCartItemQuantity)
cartRouter.put("/", applyCouponOnCartValidatorRule, applyCouponOnCart)

module.exports = cartRouter