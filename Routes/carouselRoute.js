const express = require('express');
const { carouselBackgroundImageUploadSingleImageByMulter, carouselForegroundImageUploadSingleImageByMulter, carouselImageProccessingBySharp, createCarousel, getAllCarousel, getSpecificCarousel, updateSpecificCarousel, deleteSpecificCarousel, carouselImagesUpload } = require('../Controllers/carouselController');
const { protectRoute, allowedTo } = require('../Controllers/authController')

const carouselRouter = express.Router()


carouselRouter.get("/", getAllCarousel)
carouselRouter.use(protectRoute, allowedTo("admin"))
carouselRouter.post("/", carouselImagesUpload, carouselImageProccessingBySharp, createCarousel)
carouselRouter.get("/:id", getSpecificCarousel)
carouselRouter.put("/:id", carouselImagesUpload, carouselImageProccessingBySharp, updateSpecificCarousel)
carouselRouter.delete("/:id", deleteSpecificCarousel)

module.exports = carouselRouter