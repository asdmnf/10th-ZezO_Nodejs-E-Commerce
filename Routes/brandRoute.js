const express = require('express');
const { protectRoute, allowedTo } = require('../Controllers/authController');
const { createBrand, getAllBrands, getSpecificBrand, updateSpecificBrand, deleteSpecificBrand, brandUploadSingleImageByMulter, brandImageProccessingBySharp, deleteAllBrands } = require('../Controllers/brandController');
const { createBrandValidatorRule, getSpecificBrandValidatorRule, updateSpecificBrandValidatorRule, deleteSpecificBrandValidatorRule } = require('../Validators/brandValidatorRules');
const validatorMiddleware = require('../Validators/validatorMiddleware');
const productRouter = require('./productRoute');

const brandRouter = express.Router()


brandRouter.use("/:brandIdForProducts/products", productRouter)

brandRouter.post('/', brandUploadSingleImageByMulter, protectRoute, allowedTo("admin"), brandImageProccessingBySharp, createBrandValidatorRule, validatorMiddleware, createBrand)
brandRouter.get('/', getAllBrands)
brandRouter.get('/:id', getSpecificBrandValidatorRule, validatorMiddleware, getSpecificBrand)
brandRouter.put('/:id', protectRoute, allowedTo("admin"), brandUploadSingleImageByMulter, brandImageProccessingBySharp, updateSpecificBrandValidatorRule, validatorMiddleware, updateSpecificBrand)
brandRouter.delete('/delete-all-brands', protectRoute, allowedTo("admin"), deleteAllBrands)
brandRouter.delete('/:id', protectRoute, allowedTo("admin"), deleteSpecificBrandValidatorRule, validatorMiddleware, deleteSpecificBrand)

module.exports = brandRouter