const asyncHandler = require('express-async-handler')
const { sendingEmail } = require('../Utils/sendingEmail')
const apiError = require('../Utils/apiError')
const userModel = require('../Models/userModel')

exports.sendEmailToOneUser = asyncHandler(async (req, res, next) => {
  try {
    await sendingEmail({
      to: req.body.userEmail,
      subject: "message from ZezOoo E-Commerce",
      text: req.body.message
    })
  } catch (err) {
    return next(new apiError("sending email is failed try again later", 400))
  }
  res.status(201).json({
    data: "message sent successfully",
    status: 201
  })
})

exports.sendEmailToME = asyncHandler(async (req, res, next) => {
  try {
    await sendingEmail({
      to: "egypte.2200@gmail.com",
      subject: "message from ZezOoo E-Commerce",
      text: req.body.message
    })
  } catch (err) {
    return next(new apiError("sending email is failed try again later", 400))
  }
  res.status(201).json({
    data: "message sent successfully",
    status: 201
  })
})

