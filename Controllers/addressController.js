const asyncHandler = require('express-async-handler')
const userModel = require('../Models/userModel')
const apiError = require('../Utils/apiError')

// create logged user address
exports.createAddress = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {addresses: {
        title: req.body.title,
        fullAddress: req.body.fullAddress,
        phone: req.body.phone
      }},
    },
    {
      new: true
    }
  )
  if (!document) {
    return next(new apiError("Failed to create address model", 404))
  }
  res.status(201).json({
    data: {
      _id: document._id,
      name: document.name,
      slug: document.slug,
      email: document.email,
      phone: document.phone,
      role: document.role,
      active: document.active,
      addresses: document.addresses,
    },
    status: 201
  })
})

// get logged user document
exports.getLogedUserAddresses = asyncHandler(async (req, res, next) => {
  const document = await userModel.findById(req.user._id)
  if (!document) {
    return next(new apiError("Failed to get addresses", 404))
  }
  res.status(200).json({
    data: {
      _id: document._id,
      name: document.name,
      slug: document.slug,
      email: document.email,
      phone: document.phone,
      role: document.role,
      active: document.active,
      addresses: document.addresses,
    },
    status: 200
  })
})

// update logged user address
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const document = await userModel.findOneAndUpdate(
    {
      "addresses._id": req.params.id 
    },
    {
      $set: {
        "addresses.$.title": req.body.title,
        "addresses.$.fullAddress": req.body.fullAddress,
        "addresses.$.phone": req.body.phone,
      }
    },
    {
      new: true
    }
  )
  if (!document) {
    return next(new apiError("failed to update address check address id", 404))
  }
  res.status(201).json({
    data: {
      _id: document._id,
      name: document.name,
      slug: document.slug,
      email: document.email,
      phone: document.phone,
      role: document.role,
      active: document.active,
      addresses: document.addresses,
    },
    status: 201
  })
})

// delete logged user specific address
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {addresses: {_id: req.params.id}} 
    }
    )
  if (!document) {
    return next(new apiError("Failed to delete address check address id", 404))
  }
  res.status(200).json({
    data: "address deleted successfully",
    status: 200
  })
})