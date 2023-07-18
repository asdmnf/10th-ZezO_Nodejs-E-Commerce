const brandModel = require("../Models/brandModel")
const asyncHandler = require('express-async-handler') 
const { default: slugify } = require("slugify")
const apiError = require("../Utils/apiError")
const ApiFeatures = require("../Utils/apiFeatures")
const { deleteDocument, updateDocument, getOneDocument, getAllDocuments, createDocument, deleteAllDocument } = require("../Utils/handlersFactory")
const { multerSingleImageUpload } = require("../Middlewares/imageUploadMiddleware")
const sharp = require("sharp")
const { v4: uuidv4 } = require('uuid');

exports.brandUploadSingleImageByMulter = multerSingleImageUpload("image")

exports.brandImageProccessingBySharp = asyncHandler( async (req, res, next) => {
  if (req.file) { 
    const filename = `brands-${uuidv4()}-${Date.now()}.png`
    await sharp(req.file.buffer)
    // .toFormat("jpeg")
    .png({quality: 80})
    .toFile(`uploads/brands/${filename}`)

    req.body.image = filename
  }

  next()
} )



exports.createBrand = createDocument(brandModel)




exports.getAllBrands = getAllDocuments(brandModel)



exports.getSpecificBrand = getOneDocument(brandModel)



exports.updateSpecificBrand = updateDocument(brandModel)


exports.deleteSpecificBrand = deleteDocument(brandModel)




exports.deleteAllBrands = deleteAllDocument(brandModel)