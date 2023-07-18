const { check } = require('express-validator')

exports.createSubCategoryRule = [
  check("name").notEmpty().withMessage("subcategory is required")
  .isLength({min: 2}).withMessage("subcategory must be at least 2 characters")
  .isLength({max: 32}).withMessage("subcategory must be at most 32 characters"),
  check("mainCategory").isMongoId().withMessage("Ivalid id")
  .notEmpty().withMessage("mainCategory is required")
]

exports.getSpecificSubCategoryRule = [
  check("id").isMongoId().withMessage("Invalid id")
]

exports.updateSubCategoryRule = [
  check("id").isMongoId().withMessage("Invalid id"),
  check("name").notEmpty().withMessage("subcategory is required")
  .isLength({min: 2}).withMessage("subcategory must be at least 2 characters")
  .isLength({max: 32}).withMessage("subcategory must be at most 32 characters"),
  check("mainCategory").isMongoId().withMessage("Ivalid id")
  .notEmpty().withMessage("mainCategory is required")
]

exports.deleteSubCategoryRule = [
  check("id").isMongoId().withMessage("Invalid id")
]
