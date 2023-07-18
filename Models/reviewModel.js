const { default: mongoose } = require("mongoose");
const productModel = require("./productModel");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: [3, "review title must be at least 3 characters"],
    required: [true, "review title is required"]
  },
  rating: {
    type: Number,
    trim: true, 
    min: [1, "review rating must be between 1 and 5"],
    max: [5, "review rating must be between 1 and 5"],
    required: [true, "review rating is required"]
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "products",
    required: [true, "product id is required"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "user id is required"],
  }
}, {
  timestamps: true
})

// populate user field on review document
reviewSchema.pre(/^find/, function(next) { 
  this.populate({path: "user", select: "name userImage"})
  next()
})


reviewSchema.statics.calculateAvgAndCountOfSameProduct = async function(productID) { 

  const result = await this.aggregate([ 
    {
      $match: {"product" : productID} 
    },
    {
      $group: { 
        _id: "$product", 
        ratingAvg: {$avg: "$rating"}, 
        ratingCount: {$sum: 1} 
      }
    }
  ])



  if(result.length) { 
    await productModel.findByIdAndUpdate(productID, {
      ratingAverage: Math.round(result[0].ratingAvg), 
      ratingQuantity: result[0].ratingCount 
    })
  } else { 
    await productModel.findByIdAndUpdate(productID, {
      ratingAverage: 0,
      ratingQuantity: 0
    })
  }
  

}

reviewSchema.post("save", async function(doc) { 




  await doc.constructor.calculateAvgAndCountOfSameProduct(doc.product)
})
reviewSchema.post("findOneAndDelete", async function(doc) { 
  await doc.constructor.calculateAvgAndCountOfSameProduct(doc.product) 
})

reviewSchema.post("findOneAndUpdate", async function(doc) {

  
  await doc.constructor.calculateAvgAndCountOfSameProduct(doc.product) 
})


const reviewModel = mongoose.model("Reviews", reviewSchema)

module.exports = reviewModel