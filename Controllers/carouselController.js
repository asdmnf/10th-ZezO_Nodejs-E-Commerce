const asyncHandler = require('express-async-handler')
const sharp = require("sharp")
const { v4: uuidv4 } = require('uuid');
const carouselModel = require("../Models/carouselModel");
const apiError = require("../Utils/apiError");
const { createDocument, getAllDocuments, getOneDocument, updateDocument, deleteDocument } = require("../Utils/handlersFactory");
const multer = require("multer")




const multerStorage = multer.memoryStorage()
const multerFileFilter = function(req, file, cb) {
  if (file.mimetype.startsWith("image")) { 
    cb(null, true)
  } else {
    cb(new apiError("only image files are allowed", 400), false)
  }
}
const upload = multer({storage: multerStorage, fileFilter: multerFileFilter})

exports.carouselImagesUpload = upload.fields([
  {name: "backgroundImage", maxCount: 1},
  {name: "foregroundImage", maxCount: 1}
])

exports.carouselImageProccessingBySharp = asyncHandler( async (req, res, next) => {
  if (req.files.backgroundImage) {
    const filename = `carousel-background-${uuidv4()}-${Date.now()}.png`
    await sharp(req.files.backgroundImage[0].buffer)
    .png({quality: 80})
    .toFile(`uploads/carousel/${filename}`)

    req.body.backgroundImage = filename
  }

  if (req.files.foregroundImage) {
    const filename = `carousel-foreground-${uuidv4()}-${Date.now()}.png`
    await sharp(req.files.foregroundImage[0].buffer)
    .png({quality: 80})
    .toFile(`uploads/carousel/${filename}`)

    req.body.foregroundImage = filename
  }

  next()
} )

exports.createCarousel = createDocument(carouselModel)

exports.getAllCarousel = getAllDocuments(carouselModel)

exports.getSpecificCarousel = getOneDocument(carouselModel)

exports.updateSpecificCarousel = updateDocument(carouselModel)

exports.deleteSpecificCarousel = deleteDocument(carouselModel)