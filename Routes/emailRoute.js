const express = require('express')
const { protectRoute, allowedTo } = require('../Controllers/authController')
const { sendEmailToOneUser, sendEmailToAllUsers, sendEmailToME } = require('../Controllers/emailController')

const emailRouter = express.Router()

emailRouter.post("/send-email-to-user", protectRoute, allowedTo("admin"), sendEmailToOneUser)
emailRouter.post("/send-email-to-me", sendEmailToME)

module.exports = emailRouter