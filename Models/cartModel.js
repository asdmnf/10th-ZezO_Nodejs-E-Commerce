const { default: mongoose } = require("mongoose");


const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "user id is required"]
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "products",
        required: [true, "product id is required"]
      },
      quantity: {
        type: Number,
        required: [true, "product quantity is required"] 
      },
      color: String,
      size: String,
      itemPrice: Number,
    }
  ],
  shippingFees: Number,
  taxFees: Number,
  totalPrice: Number,
  totalPriceAfterDiscount: Number,
}, {timestamps: true})


cartSchema.pre(/^find/, function(next) {
  this.populate("cartItems.product")
  next()
})

const cartModel = mongoose.model("cart", cartSchema)

module.exports = cartModel