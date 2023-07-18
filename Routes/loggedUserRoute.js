const express = require('express')
const { protectRoute, allowedTo } = require('../Controllers/authController')
const { getLoggedUserData, updateLoggedUserData, userUploadSingleImageByMulter, userImageProccessingBySharp, updateSpecificUser, updateLoggedUserPassword, changeUserPassword, deactivateLoggedUser, deactivateSpecificUser } = require('../Controllers/userController')
const { updateLoggedUserDataValidatorRule, updateLoggedUserPasswordValidatorRule } = require('../Validators/userValidatorRules')



const loggedUserRouter = express.Router()

loggedUserRouter.use(protectRoute, allowedTo("user", "admin")) 

loggedUserRouter.get("/get-my-data", getLoggedUserData)
loggedUserRouter.put("/update-my-data", userUploadSingleImageByMulter, userImageProccessingBySharp, updateLoggedUserDataValidatorRule, updateLoggedUserData, updateSpecificUser)
loggedUserRouter.put("/update-my-password", updateLoggedUserPasswordValidatorRule, updateLoggedUserPassword, changeUserPassword)
loggedUserRouter.delete("/deactivate-my-account", deactivateLoggedUser, deactivateSpecificUser)

module.exports = loggedUserRouter