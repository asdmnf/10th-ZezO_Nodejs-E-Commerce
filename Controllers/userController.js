

const asyncHandler = require('express-async-handler') 
const sharp = require("sharp");
const { default: slugify } = require('slugify');
const { v4: uuidv4 } = require('uuid')
const { multerSingleImageUpload } = require("../Middlewares/imageUploadMiddleware");
const userModel = require("../Models/userModel");
const apiError = require('../Utils/apiError');
const { createDocument, getAllDocuments, getOneDocument, updateDocument } = require('../Utils/handlersFactory');
const bcrypt = require('bcryptjs')

// upload iamge
exports.userUploadSingleImageByMulter = multerSingleImageUpload("userImage")

// sharp iamge processing
exports.userImageProccessingBySharp = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `users-${uuidv4()}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({quality: 80})
    .toFile(`uploads/users/${filename}`)
    // store name to DB
    req.body.userImage = filename
  }
  // jump to next middleware
  next()
})



// create user by admin
exports.createUser = createDocument(userModel)

// get all users by admin
exports.getAllUsers = getAllDocuments(userModel)

// get specific user by admin
exports.getSpecificUser = getOneDocument(userModel)

// update specific user data only by admin
exports.updateSpecificUser = asyncHandler( async (req, res, next) => { 




  //------------------------------------------------------------------------------------------------------------------
  // Protected Content
  const protectedIDs = [
    // allUsers
  '64a48dbaac0fc05114b51797',
  '64a48caeac0fc05114b51648',
  '64a48ba3ac0fc05114b514df',
  '64a48a5cac0fc05114b51360',
  '64a486afac0fc05114b51127',
  '646aa125492aad83e1cf5260',
  '6463fdb2112a846cfcecc91e' ,
  ]

  if (protectedIDs.includes(req.params.id)) {
    return next(new apiError("protected content! only new content can be deleted", 500))
  }
  //------------------------------------------------------------------------------------------------------------------





  const id = req.params.id
  if (req.body.name) {
    req.body.slug = slugify(req.body.name)
  }
  if (req.body.password || req.body.passwordConfirmation) { 


    return next(new apiError("password cannot change from here", 400))
  }

  const document = await userModel.findOneAndUpdate(
    {_id: id},
    req.body, 
    {new: true}
    )
  if (!document) {
    return next(new apiError("Invalid document id", 400))
  }
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
    status: 201
  })
} )

// update specific user password only by admin
exports.changeUserPassword = asyncHandler( async (req, res, next) => { 
  const id = req.params.id
  const document = await userModel.findOneAndUpdate(
    {_id: id},
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(), 
    },
    {new: true}
    )
  if (!document) {
    return next(new apiError("Invalid document id", 400))
  }
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
    status: 201
  })
} )

// deactivate specific user by admin
exports.deactivateSpecificUser = asyncHandler(async (req, res, next) => { 




//------------------------------------------------------------------------------------------------------------------
  // Protected Content
  const protectedIDs = [
    // allUsers
  '64a48dbaac0fc05114b51797',
  '64a48caeac0fc05114b51648',
  '64a48ba3ac0fc05114b514df',
  '64a48a5cac0fc05114b51360',
  '64a486afac0fc05114b51127',
  '646aa125492aad83e1cf5260',
  '6463fdb2112a846cfcecc91e' ,
  ]

  if (protectedIDs.includes(req.params.id)) {
    return next(new apiError("protected content! only new content can be deleted", 500))
  }
  //------------------------------------------------------------------------------------------------------------------





  const id = req.params.id
  const user = await userModel.findByIdAndUpdate(id, {active: false}, {new: true})
  if (!user) {
    return next(new apiError("Invalid document id", 400))
  }
  res.status(201).json({
    msg: "account deactivated successfully",
    data: { 
      _id: user._id,
      name: user.name,
      slug: user.slug,
      email: user.email,
      phone: user.phone,
      role: user.role,
      active: user.active,
    },
    status: 201
  })
})

// activate specific user by admin

exports.activateSpecificUser = asyncHandler(async (req, res, next) => { 




  //------------------------------------------------------------------------------------------------------------------
  // Protected Content
  const protectedIDs = [
    // allUsers
  '64a48dbaac0fc05114b51797',
  '64a48caeac0fc05114b51648',
  '64a48ba3ac0fc05114b514df',
  '64a48a5cac0fc05114b51360',
  '64a486afac0fc05114b51127',
  '646aa125492aad83e1cf5260',
  '6463fdb2112a846cfcecc91e' ,
  ]

  if (protectedIDs.includes(req.params.id)) {
    return next(new apiError("protected content! only new content can be deleted", 500))
  }
  //------------------------------------------------------------------------------------------------------------------



  const id = req.params.id
  const user = await userModel.findByIdAndUpdate(id, {active: true}, {new: true})
  if (!user) {
    return next(new apiError("Invalid document id", 400))
  }
  res.status(201).json({
    msg: "account activated successfully",
    data: { 
      _id: user._id,
      name: user.name,
      slug: user.slug,
      email: user.email,
      phone: user.phone,
      role: user.role,
      active: user.active,
    },
    status: 201
  })
})




// logged user get his data
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {


  //------------------------------------------------------------------------------------------------------------------
  // Protected Content
  const protectedIDs = [
    // allUsers
  '64a48dbaac0fc05114b51797',
  '64a48caeac0fc05114b51648',
  '64a48ba3ac0fc05114b514df',
  '64a48a5cac0fc05114b51360',
  '64a486afac0fc05114b51127',
  '646aa125492aad83e1cf5260',
  '6463fdb2112a846cfcecc91e' ,
  ]

  if (protectedIDs.includes(req.user._id.toString())) {
    return next(new apiError("protected content! only new content can be deleted", 500))
  }
  //------------------------------------------------------------------------------------------------------------------



  const document = req.user 

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
    status: 200
  })
})

// logged user update his data
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {


  const document = req.user 
  req.params.id = document._id


  next() 

})

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {



  //------------------------------------------------------------------------------------------------------------------
  // Protected Content
  const protectedIDs = [
    // allUsers
  '64a48dbaac0fc05114b51797',
  '64a48caeac0fc05114b51648',
  '64a48ba3ac0fc05114b514df',
  '64a48a5cac0fc05114b51360',
  '64a486afac0fc05114b51127',
  '646aa125492aad83e1cf5260',
  '6463fdb2112a846cfcecc91e' ,
  ]

  if (protectedIDs.includes(req.user._id.toString())) {
    return next(new apiError("protected content! only new content can be deleted", 500))
  }
  //------------------------------------------------------------------------------------------------------------------



  const document = req.user

  req.params.id = document._id



  next()
})


exports.deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  const document = req.user

  req.params.id = document._id



  next()
})

