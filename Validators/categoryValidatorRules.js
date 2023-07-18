const { check } = require('express-validator') 

exports.createCategoryRule = [ 
  check("name") 
  .notEmpty().withMessage("Category name is required") 
  .isLength({min: 2}).withMessage("Category name must be at least 2 characters") 
  .isLength({max: 32}).withMessage("Category name must be at most 32 characters") 
]

exports.getSpecificCategoryRule = [ 
  check("id").isMongoId().withMessage("Invalid id") 
]

exports.updateSpecificCategoryRule = [
  check("id").isMongoId().withMessage("Invalid id"),
  check("name")
  .notEmpty().withMessage("Category name is required")
  .isLength({min: 2}).withMessage("Category name must be at least 2 characters") 
  .isLength({max: 32}).withMessage("Category name must be at most 32 characters")
]

exports.deleteSpecificCategoryRule = [
  check("id").isMongoId().withMessage("Invalid id")
]


