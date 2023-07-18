const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { default: slugify } = require('slugify')
const userModel = require('../Models/userModel')
const apiError = require('../Utils/apiError')
const bcrypt = require('bcryptjs')
const { sendingEmail } = require('../Utils/sendingEmail')

exports.signUpAuth = asyncHandler(async (req, res, next) => {
  const document = await userModel.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  })
  if (!document) {
    return next(new apiError("signUp failed", 400))
  }
  const token = jwt.sign(
    {userId: document._id}, 
    process.env.JWT_SECRET_KEY,
    {expiresIn: process.env.JWT_EXPIRES_IN})

  res.status(201).json({
    data: {
      _id: document._id,
      name: document.name,
      slug: document.slug,
      email: document.email,
      phone: document.phone,
      role: document.role,
      active: document.active,
    },
    token: token,
    status: 201
  })
})

exports.logInAuth = asyncHandler(async (req, res, next) => {
  const document = await userModel.findOne({email: req.body.email})

  if (document?.active === false) { 
    return next(new apiError(`deactivated account please call the admin to activate it again`, 401))
  }

  if (!document || !(await bcrypt.compare(req.body.password, document.password))) {
    return next(new apiError("incorrect email or password", 401))
  }

  const token = jwt.sign(
    {userId: document._id},
    process.env.JWT_SECRET_KEY,
    {expiresIn: process.env.JWT_EXPIRES_IN}
  )
  res.status(200).json({ 
    data: {
      _id: document._id,
      name: document.name,
      slug: document.slug,
      email: document.email,
      phone: document.phone,
      role: document.role,
      active: document.active,
    },
    token: token,
    status: 200
  })
})


exports.protectRoute = asyncHandler(async (req, res, next) => {
  // 1- get token
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1] 
  }
  if (!token) {
    return next(new apiError("you are not logged in please login and try again", 401))
  }

  // 2- verify token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
  
  // 3- verify user still exists
  const document = await userModel.findById(decodedToken.userId)

  if (!document) {
    return next(new apiError(`your user account is not exists any more please signup again`, 401))
  }

  // 4- check if user changed password after token created
  if (document.passwordChangedAt) {
    if (parseInt(document.passwordChangedAt.getTime() / 1000, 10) > decodedToken.iat) {
      return next(new apiError(`your password has been changed please login again`, 401))
    }
  }

  if (document.active === false) {
    return next(new apiError(`deactivated account please call the admin to activate it again`, 401))
  }


  req.user = document
  next()
})


exports.allowedTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new apiError("you are not allowed to perform this action", 403))
    }
    next()
  })
}

// forgot password

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1- find document by email
  const document = await userModel.findOne({ email: req.body.email})
  if (!document) {
    next(new apiError("email is not in our DB please check your email again", 404))
  }

  // 2- generate random code (6 nums) and hash it and store it in DB 
    // generate reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString() 
    // hash reset code
  const hashedResetCode = crypto 
    .createHash('sha256')
    .update(resetCode) // 
    .digest('hex')
    // reset code expires after 10 minutes
  const resetCodeExpiration = Date.now() + (10 * 60 * 1000) 

  // store reset code data to DB
  document.passwordResetCode = hashedResetCode 
  document.passwordResetCodeExpiration = resetCodeExpiration
  document.passwordResetCodeVerifiedStatus = false


  await document.save() 

  // send reset code via nodemailer
  try { 
    await sendingEmail({ 
      to: document.email, 
      subject:"You Password Reset Code (Valid for 10 minutes)",
      text: `Hi ${document.name} \n Your Password Reset Code: ${resetCode} \n Valid for 10 minutes \n Thanks \n ZezOo Shop Team`
    })
  } catch (err) {
        document.passwordResetCode = undefined 
        document.passwordResetCodeExpiration = undefined
        document.passwordResetCodeVerifiedStatus = undefined
        await document.save()
        return next(new apiError("ResetCode sent Failiure", 500))
  }

  res.status(200).json({
    msg: `Your Password Reset Code was successfully sent to your Email: ${document.email}`,
    status: 200
  })
})

// verify reset code
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const document = await userModel.findOne({ email: req.body.email})
  if (!document) {
    return next(new apiError("Email is Wrong please check your email", 404))
  }

  const hashedResetCode = crypto
  .createHash('sha256')
  .update(req.body.resetCode)
  .digest('hex')

  if (document.passwordResetCode !== hashedResetCode) {
    return next(new apiError("invalid reset code please check it again or request another one", 404))
  }
  if (document.passwordResetCodeExpiration < Date.now()) {
    return next(new apiError("expired reset code please request another one", 404))
  }

  document.passwordResetCodeVerifiedStatus = true

  await document.save()

  res.status(200).json({
    msg: "reset code was verified successfully",
    status: 200
  })
})

// set new password
exports.setNewPassword = asyncHandler(async (req, res, next) => {
  const document = await userModel.findOne({ email: req.body.email})
  if (!document) {
    return next(new apiError("Email is Wrong please check your email", 404))
  }

  if (!document.passwordResetCodeVerifiedStatus) { 
    return next(new apiError("reset code not found request one first", 404))
  }

  document.password = req.body.newPassword 
  document.passwordChangedAt = Date.now() 
  document.passwordResetCode = undefined 
  document.passwordResetCodeExpiration = undefined
  document.passwordResetCodeVerifiedStatus = undefined

  await document.save()

  res.status(201).json({
    msg: "password changed successfully",
    status: 201
  })
})
