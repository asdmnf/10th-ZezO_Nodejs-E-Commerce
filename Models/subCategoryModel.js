const { default: mongoose } = require("mongoose");


const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "subCategory Required"],
    unique: [true, "subCategory Must Be Unique"],
    minlength: [2, 'subCategory must be at least 2 characters long'],
    maxlength: [32, 'subCategory must be at most 32 characters long'],
  },
  slug: {
    type: String,
    lowercase: true
  },
  image: String,

  mainCategory: { 
    type: mongoose.Schema.ObjectId, 
    ref: "category", 
    required: [true, "subCategory must be blongs to main category"], 
  }
}, {
  timestamps: true,
})




subCategorySchema.post("init", function(doc) {
  if (doc.image) { 
    const convertImageNameToURL = `${process.env.BASE_URL}/subcategories/${doc.image}` 
    doc.image = convertImageNameToURL
  }
})
subCategorySchema.post("save", function(doc) {
  if (doc.image) {
    const convertImageNameToURL = `${process.env.BASE_URL}/subcategories/${doc.image}`
    doc.image = convertImageNameToURL
  }
})



const subCategoryModel = mongoose.model("subCategories", subCategorySchema)

module.exports = subCategoryModel