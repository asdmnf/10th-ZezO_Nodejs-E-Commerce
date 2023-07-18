const asyncHandler = require('express-async-handler')
const feesModel = require('../Models/feesModel')
const { getAllDocuments, getOneDocument, updateDocument, deleteDocument } = require('../Utils/handlersFactory')


exports.createFees = asyncHandler(async (req, res, next) => {
  let feesDocument = await feesModel.findOne({scope: req.body.scope})

  if (!feesDocument) {
    feesDocument = await feesModel.create({
      scope: req.body.scope,
      shippingFees: req.body.shippingFees,
      taxFeesPercentage: req.body.taxFeesPercentage
    })
  } else {
    feesDocument.shippingFees = req.body.shippingFees
    feesDocument.taxFeesPercentage = req.body.taxFeesPercentage

    await feesDocument.save()
  }

  res.status(201).json({
    data: feesDocument,
    status: 201
  })
})

exports.getAllFees = getAllDocuments(feesModel)

exports.getSpecificFees = getOneDocument(feesModel)

exports.updateSpecificFees = updateDocument(feesModel)

exports.deleteSpecificFees = deleteDocument(feesModel)

