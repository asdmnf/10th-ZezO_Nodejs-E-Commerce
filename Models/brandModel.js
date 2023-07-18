const { default: mongoose } = require("mongoose");


const brandSchema = new mongoose.Schema({
  name: {
    type : String,
    trim: true,
    required: [true, 'Brand Name Required'],
    unique: [true, 'Brand Name Must Be Unique'],
    minlength: [2, 'Brand Name must be at least 2 characters long'],
    maxlength: [32, 'Brand Name must be at most 32 characters long']
  },
  slug: {
    type : String,
    lowercase: true
  },
  image: String,
}, {
  timestamps: true,
})


brandSchema.post("init", function(doc) {
  if (doc.image) {
    const convertImageNameToURL = `${process.env.BASE_URL}/brands/${doc.image}`
    doc.image = convertImageNameToURL
  }
})


const brandModel = mongoose.model("Brands", brandSchema)

module.exports = brandModel