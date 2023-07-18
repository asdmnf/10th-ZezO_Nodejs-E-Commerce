const categoryModel = require("../Models/categoryModel")
const slugify = require('slugify')
const asyncHandler = require('express-async-handler');
const apiError = require("../Utils/apiError");
const ApiFeatures = require("../Utils/apiFeatures");
const { deleteDocument, updateDocument, getOneDocument, getAllDocuments, createDocument, deleteAllDocument } = require("../Utils/handlersFactory");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const sharp = require("sharp");
const { multerSingleImageUpload } = require("../Middlewares/imageUploadMiddleware");




exports.categoryUploadSingleImageByMulter = multerSingleImageUpload("image")


exports.categoryImageProccessingBySharp = asyncHandler( async (req, res, next) => {
    if (req.file) { 
    const filename = `categories-${uuidv4()}-${Date.now()}.png`
    await sharp(req.file.buffer) 
    // .resize(800, 800) 
    // .toFormat("jpeg") 
    .png({quality: 80}) 
    .toFile(`uploads/categories/${filename}`) 

    req.body.image = filename 
    }
    next()
} )




exports.createCategory = createDocument(categoryModel)






    exports.getCategories = getAllDocuments(categoryModel)






    exports.getSpecificCategory = getOneDocument(categoryModel)



    exports.updateSpecificCategory = updateDocument(categoryModel)





    exports.deleteSpecificCategory = deleteDocument(categoryModel)


    exports.deleteAllCategories = deleteAllDocument(categoryModel)