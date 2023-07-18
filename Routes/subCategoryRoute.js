const express = require('express')
const { allowedTo, protectRoute } = require('../Controllers/authController')
const { createSubCategory, getAllSubCategories, getSpecificSubCategory, updateSubCategory, deleteSubCategory, createSubCategoryByMainCategoryId, subCategoryUploadSingleImageByMulter, subCategoryImageProccessingBySharp, deleteAllSubCategories } = require("../Controllers/subCategoryController")
const { createSubCategoryRule, getSpecificSubCategoryRule, updateSubCategoryRule, deleteSubCategoryRule } = require('../Validators/subCategoryValidatorRules')
const validatorMiddleware = require('../Validators/validatorMiddleware')
const productRouter = require('./productRoute')

const subCategoryRouter = express.Router({mergeParams: true})


subCategoryRouter.use("/:subCategoryIdForProducts/products", productRouter)

subCategoryRouter.post('/', protectRoute, allowedTo("admin"), subCategoryUploadSingleImageByMulter, subCategoryImageProccessingBySharp, createSubCategoryByMainCategoryId, createSubCategoryRule, validatorMiddleware, createSubCategory) 
subCategoryRouter.get('/', getAllSubCategories)
subCategoryRouter.get('/:id', getSpecificSubCategoryRule, validatorMiddleware, getSpecificSubCategory)
subCategoryRouter.put('/:id', protectRoute, allowedTo("admin"), subCategoryUploadSingleImageByMulter, subCategoryImageProccessingBySharp, updateSubCategoryRule, validatorMiddleware, updateSubCategory)
subCategoryRouter.delete('/delete-all-subcategories', protectRoute, allowedTo("admin"), deleteAllSubCategories)
subCategoryRouter.delete('/:id', protectRoute, allowedTo("admin"), deleteSubCategoryRule, validatorMiddleware, deleteSubCategory)

module.exports = subCategoryRouter