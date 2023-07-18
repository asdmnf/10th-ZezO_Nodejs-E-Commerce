const { default: slugify } = require("slugify")
const asyncHandler = require('express-async-handler');
const subCategoryModel = require("../Models/subCategoryModel");
const apiError = require("../Utils/apiError");
const ApiFeatures = require("../Utils/apiFeatures");
const { deleteDocument, updateDocument, getOneDocument, getAllDocuments, createDocument, deleteAllDocument } = require("../Utils/handlersFactory");
const sharp = require("sharp")
const { v4: uuidv4 } = require('uuid');
const { multerSingleImageUpload } = require("../Middlewares/imageUploadMiddleware");

exports.subCategoryUploadSingleImageByMulter = multerSingleImageUpload("image")

exports.subCategoryImageProccessingBySharp = asyncHandler( async (req, res, next) => {
  if (req.file) { 
  const filename = `subcategories-${uuidv4()}-${Date.now()}.png`
  await sharp(req.file.buffer)
  // .toFormat("jpeg")
  .png({quality: 80})
  .toFile(`uploads/subcategories/${filename}`)

  req.body.image = filename
  }
  next()
} )


  exports.createSubCategoryByMainCategoryId = (req, res, next) => { 
    if (req.params.maincategoryid) { 
      req.body.mainCategory = req.params.maincategoryid
    }
    next() 
  }



exports.createSubCategory = createDocument(subCategoryModel)



exports.getAllSubCategories = getAllDocuments(subCategoryModel)



exports.getSpecificSubCategory = getOneDocument(subCategoryModel)



exports.updateSubCategory = updateDocument(subCategoryModel)

exports.deleteSubCategory = deleteDocument(subCategoryModel)




exports.deleteAllSubCategories = deleteAllDocument(subCategoryModel)