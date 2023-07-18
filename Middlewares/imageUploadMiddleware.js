

const multer = require("multer")
const apiError = require("../Utils/apiError")





const multerSettings = () => {
  const multerStorage = multer.memoryStorage()
  const multerFileFilter = function(req, file, cb) { 
    if (file.mimetype.startsWith("image")) { 
      cb(null, true)
    } else {
      cb(new apiError("only image files are allowed", 400), false)
    }
  }
  const upload = multer({storage: multerStorage, fileFilter: multerFileFilter})
  return upload 
}


exports.multerSingleImageUpload = (fieldName) => {
  return multerSettings().single(fieldName) 
}


exports.multerMixImagesUpload = (fieldName_single, fieldName_multi) => {
  return multerSettings().fields([ 
    {name: fieldName_single, maxCount: 1},
    {name: fieldName_multi, maxCount: 5} 
  ])
}

