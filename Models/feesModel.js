const { default: mongoose } = require("mongoose");


const feesSchema = new mongoose.Schema({
  scope: String, 
  shippingFees: {
    type: Number,
    required: [true, "shippingFees is required"]
  },
  taxFeesPercentage: {
    type: Number,
    required: [true, "taxFees is required"]
  },
}, {timestamps: true})

const feesModel = mongoose.model("Fees", feesSchema)

module.exports = feesModel