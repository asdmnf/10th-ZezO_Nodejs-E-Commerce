const express = require('express');
const { protectRoute, allowedTo } = require('../Controllers/authController');
const { createCategory, getCategories, getSpecificCategory, updateSpecificCategory, deleteSpecificCategory, getCategoriesWithoutPagination, categoryUploadSingleImageByMulter, categoryImageProccessingBySharp, deleteAllCategories } = require('../Controllers/categoryController');
const { getSpecificCategoryRule, createCategoryRule, updateSpecificCategoryRule, deleteSpecificCategoryRule } = require('../Validators/categoryValidatorRules');
const validatorMiddleware = require('../Validators/validatorMiddleware');
const productRouter = require('./productRoute');
const subCategoryRouter = require('./subCategoryRoute');

const categoryRouter = express.Router()



categoryRouter.use("/:maincategoryid/subcategories", subCategoryRouter)

categoryRouter.use("/:categoryIdForProducts/products", productRouter)


categoryRouter.post('/', protectRoute, allowedTo("admin"), categoryUploadSingleImageByMulter, categoryImageProccessingBySharp, createCategoryRule, validatorMiddleware, createCategory) 
categoryRouter.get('/', getCategories)

categoryRouter.get('/:id', getSpecificCategoryRule, validatorMiddleware, getSpecificCategory)
categoryRouter.put('/:id', protectRoute, allowedTo("admin"), categoryUploadSingleImageByMulter, categoryImageProccessingBySharp, updateSpecificCategoryRule, validatorMiddleware, updateSpecificCategory) 
categoryRouter.delete('/deleta-all-categories', protectRoute, allowedTo("admin"), deleteAllCategories)
categoryRouter.delete('/:id', protectRoute, allowedTo("admin"), deleteSpecificCategoryRule, validatorMiddleware, deleteSpecificCategory)


module.exports = categoryRouter