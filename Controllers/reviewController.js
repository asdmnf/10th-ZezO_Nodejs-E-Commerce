const { response } = require('express');
const asyncHandler = require('express-async-handler');
const reviewModel = require("../Models/reviewModel");
const apiError = require('../Utils/apiError');
const { createDocument, getAllDocuments, getOneDocument, updateDocument, deleteDocument } = require("../Utils/handlersFactory");


// create review

exports.setUserIdFromProtectRoute = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id
  next()
})
exports.createReview = createDocument(reviewModel)

// get all reviews
exports.getAllReviews = getAllDocuments(reviewModel)

// get specific review
exports.getSpecificReview = getOneDocument(reviewModel)

// update specific review
exports.updateSpecificReview = updateDocument(reviewModel)

// delete specific review
exports.deleteSpecificReview = deleteDocument(reviewModel)

// create review on a specific product by nested route

exports.createReviewOnSpecificProductForNestedRoute = asyncHandler(async (req, res, next) => {

  if (req.params.productIdforReviews) {
    req.body.product = req.params.productIdforReviews
  }
  next()
})

