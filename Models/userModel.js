const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs')

// schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
    minlength: [2, "name must be at least 2 characters"]
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    required: [true, "email is required"],
    unique: [true, "email must be unique"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "password must be at least 8 characters"],

  },
  passwordChangedAt: Date, 
  passwordResetCode: String,
  passwordResetCodeExpiration: Date, 
  passwordResetCodeVerifiedStatus: Boolean, 
  phone: {
    type: String,
    unique: [true, "phone must be unique"],
  },
  userImage: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  active: { 
    type: Boolean,
    default: true,
  },


  addresses: [ 
    { 
      title: {
        type: String,
        trim: true,
      },
      fullAddress: {
        type: String,
        trim: true,
        required: [true, "fullAddress is required"]
      },
      phone: {
        type: Number,
        trim: true,
        required: [true, "phone is required"]
      },
    }
  ]

}, {timestamps: true})

// encrypt password using bcryptjs library

userSchema.pre("save", async function(next) { 
  if (!this.isModified("password")) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, 12) 
  next()
})

// convert name in db to URL in response
userSchema.post("init", function(doc) {
  if (doc.userImage) {
    const convertImageNameToURL = `${process.env.BASE_URL}/users/${doc.userImage}` 
    doc.userImage = convertImageNameToURL
  }


})
// convert name in db to URL in response with create document
userSchema.post("save", function(doc) {
  if (doc.userImage) {
    const convertImageNameToURL = `${process.env.BASE_URL}/users/${doc.userImage}` 
    doc.userImage = convertImageNameToURL
  }
})

// model
const userModel = mongoose.model('Users', userSchema)

module.exports = userModel