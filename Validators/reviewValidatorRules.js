const { check } = require('express-validator');
const productModel = require('../Models/productModel');
const reviewModel = require('../Models/reviewModel');
const userModel = require('../Models/userModel');
const validatorMiddleware = require('./validatorMiddleware');


exports.createReviewValidatorRule = [
  check("title")
  .notEmpty().withMessage("title is required")
  .isLength({min: 3}).withMessage("title must be at least 3 characters"),

  check("rating")
  .notEmpty().withMessage("rating is required")
  .isNumeric().withMessage("rating must be number")
  .isInt({min: 1, max: 5}).withMessage("rating must integer be between 1 and 5"), 

  check("product")
  .notEmpty().withMessage("product id is required")
  .isMongoId().withMessage("check your product id")
  .custom(async (id, {req}) => {
    const document = await productModel.findById(id)
    if (!document) {
      throw new Error("product not found check your product id")
    }

    const filteredReviewDocumentByProductAndUser = await reviewModel.findOne({product: id, user: req.user._id}) 
    if (filteredReviewDocumentByProductAndUser) {
      throw new Error("you cannot review a product twice")
    }
    return true
  }),

  validatorMiddleware
]

exports.getSpecificReviewValidatorRule = [
  check("id")
  .isMongoId().withMessage("check your review id"),
  validatorMiddleware
]

exports.updateSpecificReviewValidatorRule = [
  check("id")
  .isMongoId().withMessage("check your review id")

  .custom(async (id, {req}) => {

    const document = await reviewModel.findById(id) 
    if (!document) {
      throw new Error("review not found check your review id")
    }
    if (document.user._id.toString() !== req.user._id.toString()) { 
      throw new Error("you can only edit your review check your user id or your review id")
    }
    return true
  }),

  check("title").optional()
  .isLength({min: 3}).withMessage("title must be at least 3 characters"),

  check("rating").optional()
  .notEmpty().withMessage("rating is required")
  .isNumeric().withMessage("rating must be number")
  .isInt({min: 1, max: 5}).withMessage("rating must be integer between 1 and 5"),




  validatorMiddleware
]

exports.deleteSpecificReviewValidatorRule = [
  check("id")
  .isMongoId().withMessage("check your review id")
  .custom(async (id, {req}) => { 
    const document = await reviewModel.findById(id)
    if (!document) {
      throw new Error("review not found check your review id")
    }

    if (req.user.role === "user" && document.user._id.toString() !== req.user._id.toString()) {
      throw new Error("you can only delete your review")
    }
    return true
  }),
  validatorMiddleware
]
