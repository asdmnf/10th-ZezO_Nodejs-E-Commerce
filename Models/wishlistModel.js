

const { default: mongoose } = require("mongoose");


const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "user id is required"]
  },
  product:{
      type: mongoose.Schema.ObjectId,
      ref: "products",
      required: [true, "product id is required"]
    }
})

// populate product
wishlistSchema.pre("find", function(next) {
  this.populate("product")
  next()
})


const wishlistModel = mongoose.model("Wishlists", wishlistSchema)

module.exports = wishlistModel