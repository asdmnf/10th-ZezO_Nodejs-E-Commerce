const { check } = require('express-validator');
const brandModel = require('../Models/brandModel');
const categoryModel = require('../Models/categoryModel');
const subCategoryModel = require('../Models/subCategoryModel');
const validatorMiddleware = require('./validatorMiddleware');

exports.createProductValidation = [
  check("title").notEmpty().withMessage("Product title is required")
  .isLength({min: 10}).withMessage("Product title must be at least 10 characters")
  .isLength({max: 100}).withMessage("Product title must be at most 100 characters"),

  check("description").notEmpty().withMessage("Product description is required")
  .isLength({min: 20}).withMessage("Product description must be at least 20 characters"),

  check("mainCategory")
  .notEmpty().withMessage("Product mainCategory is required")
  .isMongoId().withMessage("invalid mainCategory id")
  .custom(async id => { 
    await categoryModel.findById(id).then(category => { 
      if (!category) {
        return Promise.reject(new Error(`this id is not category id`)) 
      }
    })
  }),

  check("subCategory")
  .notEmpty().withMessage("Product subCategory is required")
  .isMongoId().withMessage("invalid subCategory id")
  .toArray()
  .custom(async ids => {
    await subCategoryModel.find({_id: {$exists: true, $in: ids}}).then(subCategories => { 
      if  (subCategories.length !== ids.length) { 
        return Promise.reject(new Error(`subCategory id/s is not subCategory id`)) 
      } else if (subCategories.length) {
        return true
      }
    })
  })
  .custom(async (subsId, {req}) => { 
    await subCategoryModel.find({mainCategory: req.body.mainCategory}).then((subCategories) => { 
      const subcategoriesIdsOnlyInDB = [] 
      subCategories.map(subCategory => { 
        subcategoriesIdsOnlyInDB.push(subCategory._id.toString()) 
      })
      if (!subsId.every(id => subcategoriesIdsOnlyInDB.includes(id))) { 
        return Promise.reject(new Error(`one or more subcategories IDs doesn't belong to MainCategory`)) 
      }
    })
  }),

  check("brand")
  .notEmpty().withMessage("Product brand is required")
  .isMongoId().withMessage("invalid brand id")
  .custom(async id => { 
    await brandModel.findById(id).then(brand => { 
      if (!brand) {
        return Promise.reject(new Error(`this id is not brand id`))
      }
    })
  }),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),

  check("iamgesGallery").optional() 
  .toArray()
  ,

  check("color").optional() 
  .toArray()
  ,

  check("quantity").notEmpty().withMessage("Product quantity is required")
  .isNumeric().withMessage("Product quantity must be numeric")
  .isInt({min: 0}).withMessage("Product quantity cannot be negative"),

  check("sold").optional()
  .isNumeric().withMessage("Product sold must be numeric"), 

  check("price").notEmpty().withMessage("Product price is required")
  .isNumeric().withMessage("Product price must be numeric")
  .isInt({min: 0}).withMessage("Product price cannot be negative"),

  check("priceAfterDiscount").optional() 
  .isNumeric().withMessage("Product priceAfterDiscount must be numeric")
  .isInt({min: 0}).withMessage("Product priceAfterDiscount cannot be negative")
  .toFloat() 
  .custom((value, {req} ) => { 
    if (req.body.price <= value) {
      throw new Error("Product priceAfterDiscount must be less than price") 
    }
    return true
  }),

  check("ratingAverage").optional()
  .isNumeric().withMessage("Product ratingAverage must be numeric")
  .isInt({min: 1}).withMessage("Product ratingAverage must be from 1 to 5")
  .isInt({max: 5}).withMessage("Product ratingAverage must be from 1 to 5"),

  check("ratingQuantity").optional()
  .isNumeric().withMessage("Product ratingQuantity must be numeric"),

  validatorMiddleware 


]

exports.getSpecificProductValidation = [
  check("id").isMongoId().withMessage("Invalid id"),
  validatorMiddleware
]

exports.updateSpecificProductValidation = [
  check("id").isMongoId().withMessage("Invalid id"),

  check("title").optional()
  .isLength({min: 10}).withMessage("Product title must be at least 10 characters")
  .isLength({max: 100}).withMessage("Product title must be at most 100 characters"),

  check("description").optional()
  .isLength({min: 20}).withMessage("Product description must be at least 20 characters"),

  check("mainCategory")
  .optional()
  .isMongoId().withMessage("invalid mainCategory id")
  .custom(async id => { 
    await categoryModel.findById(id).then(category => { 
      if (!category) {
        return Promise.reject(new Error(`this id is not category id`)) 
      }
    })
  }),

  check("subCategory")
  .optional()
  .isMongoId().withMessage("invalid subCategory id")
  .toArray()
  .custom(async ids => {
    await subCategoryModel.find({_id: {$exists: true, $in: ids}}).then(subCategories => {
      if  (subCategories.length !== ids.length) { 
        return Promise.reject(new Error(`subCategory id/s is not subCategory id`)) 
      } else if (subCategories.length) {
        return true
      }
    })
  })
  .custom(async (subsId, {req}) => { 
    await subCategoryModel.find({mainCategory: req.body.mainCategory}).then((subCategories) => { 
      const subcategoriesIdsOnlyInDB = [] 
      subCategories.map(subCategory => { 
        subcategoriesIdsOnlyInDB.push(subCategory._id.toString()) 
      })
      if (!subsId.every(id => subcategoriesIdsOnlyInDB.includes(id))) { 
        return Promise.reject(new Error(`one or more subcategories IDs doesn't belong to MainCategory`)) 
      }
    })
  }),

  check("brand")
  .optional()
  .isMongoId().withMessage("invalid brand id")
  .custom(async id => { 
    await brandModel.findById(id).then(brand => { 
      if (!brand) {
        return Promise.reject(new Error(`this id is not brand id`))
      }
    })
  }),

  check("imageCover").optional(),

  check("iamgesGallery").optional() 
  .toArray()
  ,

  check("color").optional()
  .toArray()
  ,

  check("quantity").optional()
  .isNumeric().withMessage("Product quantity must be numeric")
  .isInt({min: 0}).withMessage("Product quantity cannot be negative"),

  check("sold").optional()
  .isNumeric().withMessage("Product sold must be numeric"),

  check("price").optional()
  .isNumeric().withMessage("Product price must be numeric")
  .isInt({min: 0}).withMessage("Product price cannot be negative"),

  check("priceAfterDiscount").optional()
  .isNumeric().withMessage("Product priceAfterDiscount must be numeric")
  .isInt({min: 0}).withMessage("Product priceAfterDiscount cannot be negative")
  .toFloat() 
  .custom((value, {req} ) => { 
    if (req.body.price <= value) { 
      throw new Error("Product priceAfterDiscount must be less than price") 
    }
    return true 
  }),

  check("ratingAverage").optional()
  .isNumeric().withMessage("Product ratingAverage must be numeric")
  .isInt({min: 1}).withMessage("Product ratingAverage must be from 1 to 5")
  .isInt({max: 5}).withMessage("Product ratingAverage must be from 1 to 5"),

  check("ratingQuantity").optional()
  .isNumeric().withMessage("Product ratingQuantity must be numeric"),
  validatorMiddleware
]

exports.deleteSpecificProductValidation = [
  check("id").isMongoId().withMessage("Invalid id"),
  validatorMiddleware
]

