const { default: mongoose } = require("mongoose");


const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "coupon name is required"],
    unique: [true, "coupon name is unique"],
  },
  slug: String,
  discountPercentage: {
    type: Number,
    trim: true,
    required: [true, "discount is required"],
  },
  maxDiscount: Number,
  expireDate: {
    type: Date,
    required: [true, "expire date is required"],
  }
}, {timestamps: true})

const couponModel = mongoose.model("Coupon", couponSchema)

module.exports = couponModel