const express = require('express')
const { protectRoute, allowedTo } = require('../Controllers/authController')
const { createProduct, getAllProducts, getSpecificProduct, updateSpecificProduct, deleteSpecificProduct, productImageProccessingBySharp, productUploadMixImagesByMulter, deleteAllProducts } = require('../Controllers/productController')
const { createProductValidation, getSpecificProductValidation, updateSpecificProductValidation, deleteSpecificProductValidation } = require('../Validators/productValidatorRules')
const reviewRouter = require('./reviewRoute')

const productRouter = express.Router({mergeParams: true}) 
productRouter.use("/:productIdforReviews/reviews", reviewRouter)


productRouter.post("/", protectRoute, allowedTo("admin"), productUploadMixImagesByMulter, productImageProccessingBySharp, createProductValidation, createProduct)
productRouter.get("/", getAllProducts)
productRouter.get("/:id", getSpecificProductValidation, getSpecificProduct)
productRouter.put("/:id", protectRoute, allowedTo("admin"), productUploadMixImagesByMulter, productImageProccessingBySharp, updateSpecificProductValidation, updateSpecificProduct)
productRouter.delete("/delete-all-products", protectRoute, allowedTo("admin"), deleteAllProducts)
productRouter.delete("/:id", protectRoute, allowedTo("admin"), deleteSpecificProductValidation, deleteSpecificProduct)

module.exports = productRouter