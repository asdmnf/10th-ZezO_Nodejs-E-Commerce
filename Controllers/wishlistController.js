const asyncHandler = require('express-async-handler')
const wishlistModel = require("../Models/wishlistModel");
const apiError = require('../Utils/apiError');

// add product to wishlist
exports.createProductOnWishlist = asyncHandler(async (req, res, next) => {

  const document = await wishlistModel.create({
    user: req.user._id, // من البروتيكتيد روت
    product: req.body.product
  })
  res.status(201).json({
    data: document,
    status: 201
  })
})

// get logged user wishlist
exports.getWishlistForSpecificUser = asyncHandler(async (req, res, next) => {
  const wishlistDocuments = await wishlistModel.find({user: req.user._id})
  if (!wishlistDocuments) {
    return next(new apiError("wishlistDocuments not found", 404))
  }
  res.status(200).json({
    results: wishlistDocuments.length,
    data: wishlistDocuments,
    status: 200
  })
})

// delete product from wishlist
exports.deleteOneProductFromWishlist = asyncHandler(async (req, res, next) => {

  const document = await wishlistModel.findOneAndDelete({
    user: req.user._id,
    product: req.params.id
  })
  if (!document) {
    return next(new apiError("wishlistDocument not found check product id", 404))
  }
  res.status(200).json({
    data: "wishlistDocument Deleted Successfully",
    status: 200
  })
})