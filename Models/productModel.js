const { default: mongoose, Schema } = require("mongoose");



const productSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "product title is required"],
    minlength: [10, "product title must be at least 10 characters"],
    maxlength: [100, "product title must be at most 100 characters"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "product title is required"],
    minlength: [20, "product title must be at least 20 characters"],
  },
  mainCategory: {
    type: mongoose.Schema.ObjectId,
    ref: "category",
    required: [true, "product mainCategory is required"]
  },
  subCategory: [ 
    {
      type: mongoose.Schema.ObjectId,
      ref: "subCategories",
      required: [true, "product subCategory is required"]
    },
  ],
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brands",
    required: [true, "product brand is required"]
  },
  imageCover: {
    type: String,
    required: [true, "product imageCover is required"]
  },
  iamgesGallery: [String],
  color: [String],
  quantity: {
    type: Number,
    required: [true, "product quantity is required"]
  },
  sold: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "product price is required"],
    min: [0, "product price cannot be negative"],
  },
  priceAfterDiscount: {
    type: Number,
    min: [0, "product price cannot be negative"],
  },
  ratingAverage: {
    type: Number,
    min: [1, "product ratingAverage must be at least 1"],
    max: [5, "product ratingAverage must be at most 5"],
  },
  ratingQuantity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
})



productSchema.virtual("reviews", { 
  ref: "Reviews", 
  foreignField: "product",
  localField: "_id" 
})


productSchema.pre(/^find/, function(next) { 
  this.populate({path: "mainCategory", select: "name image"}).populate({path: "subCategory", select: "name image"}).populate({path: "brand", select: "name image"})
  next() 
})


productSchema.post("init", function(doc) {
  if (doc.imageCover) {
    const convertImageNameToURL = `${process.env.BASE_URL}/products/${doc.imageCover}`
    doc.imageCover = convertImageNameToURL
  }
})
productSchema.post("save", function(doc) {
  if (doc.imageCover) {
    const convertImageNameToURL = `${process.env.BASE_URL}/products/${doc.imageCover}`
    doc.imageCover = convertImageNameToURL
  }
})

productSchema.post("init", function(doc) { 
  if (doc.iamgesGallery) {
    const iamgesGalleryNames = []
    doc.iamgesGallery.map(item => {
      const convertImageNameToURL = `${process.env.BASE_URL}/products/${item}`
      iamgesGalleryNames.push(convertImageNameToURL)
    })
    doc.iamgesGallery = iamgesGalleryNames
  }
})
productSchema.post("save", function(doc) {
  if (doc.iamgesGallery) {
    const iamgesGalleryNames = []
    doc.iamgesGallery.map(item => {
      const convertImageNameToURL = `${process.env.BASE_URL}/products/${item}`
      iamgesGalleryNames.push(convertImageNameToURL)
    })
    doc.iamgesGallery = iamgesGalleryNames
  }
})

const productModel = mongoose.model("products", productSchema)

module.exports = productModel