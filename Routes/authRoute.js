const express = require('express')
const { signUpAuth, logInAuth, forgotPassword, verifyResetCode, setNewPassword } = require('../Controllers/authController')
const { signUpAuthValidatorRule, logInAuthValidatorRule, forgotPasswordValidatorRule, verifyResetCodeValidatorRule, setNewPasswordValidatorRule } = require('../Validators/authValidatorRules')

const authRouter = express.Router()

authRouter.post("/signup", signUpAuthValidatorRule, signUpAuth)
authRouter.post("/login", logInAuthValidatorRule, logInAuth)
authRouter.post("/forgot-password", forgotPasswordValidatorRule, forgotPassword)
authRouter.post("/verify-rset-code", verifyResetCodeValidatorRule, verifyResetCode)
authRouter.put("/set-new-password", setNewPasswordValidatorRule, setNewPassword)

module.exports = authRouter