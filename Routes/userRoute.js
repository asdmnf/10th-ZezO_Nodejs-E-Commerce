const express = require('express')
const { protectRoute, allowedTo } = require('../Controllers/authController')
const { userUploadSingleImageByMulter, userImageProccessingBySharp, createUser, getAllUsers, getSpecificUser, updateSpecificUser, deactivateSpecificUser, changeUserPassword, activateSpecificUser } = require('../Controllers/userController')
const { createUserValidatorRule, getSpecificUserValidatorRule, updateSpecificUserValidatorRule, deleteSpecificUserValidatorRule, changeUserPasswordValidatorRule } = require('../Validators/userValidatorRules')

const userRouter = express.Router()



userRouter.use(protectRoute, allowedTo("admin")) 

userRouter.post("/", userUploadSingleImageByMulter, userImageProccessingBySharp, createUserValidatorRule, createUser)
userRouter.get("/", getAllUsers)
userRouter.get("/:id", getSpecificUserValidatorRule, getSpecificUser)
userRouter.put("/:id", userUploadSingleImageByMulter, userImageProccessingBySharp, updateSpecificUserValidatorRule, updateSpecificUser)
userRouter.put("/change-password/:id", changeUserPasswordValidatorRule, changeUserPassword)
userRouter.delete("/:id", deleteSpecificUserValidatorRule, deactivateSpecificUser)
userRouter.put("/activate-account/:id", deleteSpecificUserValidatorRule, activateSpecificUser)

module.exports = userRouter