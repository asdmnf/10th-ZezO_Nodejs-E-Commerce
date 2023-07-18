const express = require('express');
const { createFees, getAllFees, getSpecificFees, updateSpecificFees, deleteSpecificFees } = require('../Controllers/feesController');
const { createFeesValidation, getSpecificFeesValidation, updateSpecificFeesValidation, deleteSpecificFeesValidation } = require('../Validators/feesValidatorRules');
const { protectRoute, allowedTo } = require('../Controllers/authController');

const feesRouter = express.Router()

feesRouter.use(protectRoute, allowedTo("admin"))

feesRouter.post("/", createFeesValidation, createFees)
feesRouter.get("/", getAllFees)
feesRouter.get("/:id", getSpecificFeesValidation, getSpecificFees)
feesRouter.put("/:id", updateSpecificFeesValidation, updateSpecificFees)
feesRouter.delete("/:id", deleteSpecificFeesValidation, deleteSpecificFees)

module.exports = feesRouter