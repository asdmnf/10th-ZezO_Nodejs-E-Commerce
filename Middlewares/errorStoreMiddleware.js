const apiError = require("../Utils/apiError")


const errorStoreMiddleware = (err, req, res, next) => { 
  err.statusText = err.statusText || "Error" 
  err.statusCode = err.statusCode || 500
  err.statusMessage = err.statusMessage || "Internal Error"

  if (process.env.NODE_ENV === 'development') { 

    if (err.name === "JsonWebTokenError") { 

      err = new apiError("invalid token payload please check your data and login again", 401) 
    }
    if (err.name === "TokenExpiredError") {
      err = new apiError("expired token please login again", 401)
    }

    if (err.code === 11000) { 
      err = new apiError("duplicated value please try another value", 400)
    }

    if (err.reason === "wrong version number") { 
      err = new apiError("you email transporter port is incorrect", 500)
    }
    if (err.responseCode === 535) { 
      err = new apiError("you Gmail setting -Less secure app access- is off or App Password not working check gmail setting and try again", 500)
    }

    res.status(err.statusCode).json({ 
      error: err, 
      stack: err.stack 
      
  })
  } else { 

    if (err.name === "JsonWebTokenError") {
      err = new apiError("invalid token payload please check your data and login again", 401)
    }
    if (err.name === "TokenExpiredError") {
      err = new apiError("expired token please login again", 401)
    }

    if (err.code === 11000) {
      err = new apiError("duplicated value please try another value", 400)
    }

    res.status(err.statusCode).json({
      error: {
        statusText: err.statusText,
        statusCode: err.statusCode,
        statusMessage: err.statusMessage
      },
  })
  }
}

module.exports = errorStoreMiddleware