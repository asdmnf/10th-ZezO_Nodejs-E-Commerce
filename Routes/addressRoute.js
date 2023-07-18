const express = require('express')
const { protectRoute, allowedTo } = require('../Controllers/authController')
const { createAddress, getLogedUserAddresses, deleteAddress, updateAddress } = require('../Controllers/addressController')
const { createAddressValidatorRule, deleteAddressValidatorRule, updateAddressValidatorRule } = require('../Validators/addressValidatorRules')

const addressRouter = express.Router()

addressRouter.use(protectRoute, allowedTo("user"))

addressRouter.post("/", createAddressValidatorRule, createAddress)
addressRouter.get("/", getLogedUserAddresses)
addressRouter.put("/:id", updateAddressValidatorRule, updateAddress)
addressRouter.delete("/:id", deleteAddressValidatorRule, deleteAddress)

module.exports = addressRouter