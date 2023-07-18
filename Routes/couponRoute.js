const express = require('express')
const { createCoupon, getAllCoupons, getSpecificCoupon, updateSpecificCoupon, deleteSpecificcoupon } = require('../Controllers/couponController')
const { protectRoute, allowedTo } = require('../Controllers/authController')
const { createCouponValidatorRule, getSpecificCouponValidatorRule, updateSpecificCouponValidatorRule, deleteSpecificcouponValidatorRule } = require('../Validators/couponValidatorRules')

const couponRouter = express.Router()

couponRouter.use(protectRoute, allowedTo("admin"))

couponRouter.post("/", createCouponValidatorRule, createCoupon)
couponRouter.get("/", getAllCoupons)
couponRouter.get("/:id", getSpecificCouponValidatorRule, getSpecificCoupon)
couponRouter.put("/:id", updateSpecificCouponValidatorRule, updateSpecificCoupon)
couponRouter.delete("/:id", deleteSpecificcouponValidatorRule, deleteSpecificcoupon)

module.exports = couponRouter