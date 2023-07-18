const express = require('express');
const { protectRoute, allowedTo } = require('../Controllers/authController');
const { createReview, getAllReviews, getSpecificReview, updateSpecificReview, deleteSpecificReview, setUserIdFromProtectRoute, createReviewOnSpecificProductForNestedRoute, getSpecificReviewForSpecificProduct } = require('../Controllers/reviewController');
const { createReviewValidatorRule, deleteSpecificReviewValidatorRule, getSpecificReviewValidatorRule, updateSpecificReviewValidatorRule, getSpecificReviewForSpecificProductValidatorRule } = require('../Validators/reviewValidatorRules');

const reviewRouter = express.Router({mergeParams: true})

reviewRouter.post("/", protectRoute, allowedTo("user"), createReviewOnSpecificProductForNestedRoute, createReviewValidatorRule, setUserIdFromProtectRoute, createReview)
reviewRouter.get("/", getAllReviews)


reviewRouter.get("/:id", protectRoute, allowedTo("user", "admin"), getSpecificReviewValidatorRule, getSpecificReview)
reviewRouter.put("/:id", protectRoute, allowedTo("user"), updateSpecificReviewValidatorRule, updateSpecificReview)
reviewRouter.delete("/:id", protectRoute, allowedTo("user", "admin"), deleteSpecificReviewValidatorRule, deleteSpecificReview)



module.exports = reviewRouter