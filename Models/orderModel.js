const { default: mongoose } = require("mongoose");


const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "order user is required"]
  },
  cartItems: [ 
    {
      product: {
        

        _id: { 
          type: String,
        },
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        mainCategory: {
          type: String,
        },
        brand: {
          type: String,
        },
        imageCover: {
          type: String,
        },
        price: {
          type: Number,
        },
        priceAfterDiscount: {
          type: Number,
        },
        isDeleted: {
          type: Boolean,
        },
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
  shippingAddress: { 


    title: {
      type: String,
      trim: true,
    },
    fullAddress: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
  },
  orderPrice: Number,
  shippingFees: Number, 
  taxFees: Number,
  totalPayment: Number,
  paymentMethod: {
    type: String,
    default: "cash",
    enum: ["cash", "visa"]
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidDate: Date,
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredDate: Date,
  updates: [ 
    {
      update: String,
      createdAt: Date 
    },
  ],
}, {timestamps: true})

orderSchema.pre(/^find/, function(next) {
  this.populate({path: "user", select:"-password -active"})

  next()
})

const orderModel = mongoose.model("Order", orderSchema)

module.exports = orderModel