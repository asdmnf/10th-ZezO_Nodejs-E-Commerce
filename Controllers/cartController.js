const asyncHandler = require('express-async-handler')
const cartModel = require('../Models/cartModel')
const productModel = require('../Models/productModel')
const apiError = require('../Utils/apiError')
const couponModel = require('../Models/couponModel')
const feesModel = require('../Models/feesModel')


exports.createCart = asyncHandler(async (req, res, next) => {

  let cartDocument = await cartModel.findOne({user: req.user._id}) 
  const productDocument = await productModel.findById(req.body.product) 

  if (productDocument.quantity < req.body.quantity) {
    return next(new apiError("not enought quantity for this product please wait to resupply or try to reduce quantity", 400))
  }

  if (!cartDocument) {
    cartDocument = await cartModel.create({ 
      user: req.user._id,
      cartItems: [ 
        {
          product: req.body.product,
          quantity: req.body.quantity,
          color: req.body.color,
          size: req.body.size,
          itemPrice: productDocument.priceAfterDiscount ? 
          productDocument.priceAfterDiscount * req.body.quantity : 
          productDocument.price * req.body.quantity 
        }
      ]
    })
  } else { 
    const sameCartItemIndex = cartDocument.cartItems.findIndex(item => { 
      return item.product._id.toString() === req.body.product && item.color === req.body.color && item.size === req.body.size 
    })
    if (sameCartItemIndex > -1) { 
      cartDocument.cartItems[sameCartItemIndex].quantity += req.body.quantity * 1 
      cartDocument.cartItems[sameCartItemIndex].itemPrice += (productDocument.priceAfterDiscount ? productDocument.priceAfterDiscount : productDocument.price) *  req.body.quantity * 1 
    } else { 
      cartDocument.cartItems.push({ 
        product: req.body.product,
        quantity: req.body.quantity,
        color: req.body.color,
        size: req.body.size,
        itemPrice: productDocument.priceAfterDiscount ? 
        productDocument.priceAfterDiscount * req.body.quantity : 
        productDocument.price * req.body.quantity
      })
    }
  }

  
  let totalPrice = 0
  cartDocument.cartItems.map(item => {
    totalPrice += item.itemPrice 
  })





  const feesDocument = await feesModel.findOne({scope: "global"})

  const shippingFees = feesDocument?.shippingFees ? feesDocument?.shippingFees : 0;
  const taxFees = feesDocument?.taxFeesPercentage ? ((totalPrice * feesDocument?.taxFeesPercentage) / 100) : 0;
  const totalPayment = totalPrice + shippingFees + taxFees

  cartDocument.shippingFees = shippingFees * 1
  cartDocument.taxFees = taxFees * 1
  cartDocument.totalPrice = totalPayment * 1





  if (cartDocument.totalPriceAfterDiscount) {
    cartDocument.totalPriceAfterDiscount = undefined 
  }

  await cartDocument.save() 

  res.status(201).json({
    numberOfCartItems: cartDocument.cartItems.length,
    data: cartDocument,
    status: 201,
  })
})

// get logge User Cart
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cartDocument = await cartModel.findOne({user: req.user._id})
  if (!cartDocument) {
    return next(new apiError("no cart until yet", 404))
  }
  res.status(200).json({
    numberOfCartItems: cartDocument.cartItems.length,
    data: cartDocument,
    status: 200,
  })
})


exports.deleteSpecificProductFromCart = asyncHandler(async (req, res, next) => {

  const cartDocument = await cartModel.findOneAndUpdate( 
    {user: req.user._id, "cartItems._id": req.params.cartItemID}, 
    {
      $pull: {cartItems: {_id: req.params.cartItemID}} 
    },
    {new: true}
  )

  if (!cartDocument) {
      return next(new apiError("cart item product not found check cart item id", 404))
    }

  let totalPrice = 0 
  cartDocument.cartItems.map(item => {
    totalPrice += item.itemPrice
  })




  const feesDocument = await feesModel.findOne({scope: "global"})

  const shippingFees = feesDocument?.shippingFees ? feesDocument?.shippingFees : 0;
  const taxFees = feesDocument?.taxFeesPercentage ? ((totalPrice * feesDocument?.taxFeesPercentage) / 100) : 0;
  const totalPayment = totalPrice + shippingFees + taxFees

  cartDocument.shippingFees = shippingFees * 1
  cartDocument.taxFees = taxFees * 1
  cartDocument.totalPrice = totalPayment * 1



  if (cartDocument.totalPriceAfterDiscount) { 
    cartDocument.totalPriceAfterDiscount = undefined 
  }

  await cartDocument.save()





  res.status(200).json({
    numberOfCartItems: cartDocument.cartItems.length,
    data: cartDocument,
    status: 200
  })
})

exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cartDocument = await cartModel.findOneAndDelete({user: req.user._id}) 
  if (!cartDocument) {
    return next(new apiError("failed to clear, user cart not found", 404))
  }
  res.status(200).json({
    data: "cart cleared successfully",
    status: 200
  })
})

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cartDocument = await cartModel.findOneAndUpdate(
    {user: req.user._id, "cartItems._id": req.params.cartItemID},
    {
      $set: {
        "cartItems.$.quantity": req.body.quantity 
      }
    },
    {new: true}
  )

  if (!cartDocument) {
    return next(new apiError("cart item product not found check cart item id", 404))
  }

  const updatedCartItemIndex = cartDocument.cartItems.findIndex(item => item._id.toString() === req.params.cartItemID) 
  if (updatedCartItemIndex > -1) {
    cartDocument.cartItems[updatedCartItemIndex].itemPrice = 
    cartDocument.cartItems[updatedCartItemIndex].quantity * (
    cartDocument.cartItems[updatedCartItemIndex].product.priceAfterDiscount ? 
    cartDocument.cartItems[updatedCartItemIndex].product.priceAfterDiscount :
    cartDocument.cartItems[updatedCartItemIndex].product.price
  )
  }
  
  

let totalPrice = 0 
cartDocument.cartItems.map(item => { 
  totalPrice += item.itemPrice
})

  const feesDocument = await feesModel.findOne({scope: "global"})

  const shippingFees = feesDocument?.shippingFees ? feesDocument?.shippingFees : 0;
  const taxFees = feesDocument?.taxFeesPercentage ? ((totalPrice * feesDocument?.taxFeesPercentage) / 100) : 0;
  const totalPayment = totalPrice + shippingFees + taxFees

  cartDocument.shippingFees = shippingFees * 1
  cartDocument.taxFees = taxFees * 1
  cartDocument.totalPrice = totalPayment * 1




if (cartDocument.totalPriceAfterDiscount) {
  cartDocument.totalPriceAfterDiscount = undefined 
}

await cartDocument.save()

res.status(201).json({
  data: cartDocument,
  status: 201
})
})


exports.applyCouponOnCart = asyncHandler(async (req, res, next) => {

  const couponDocument = await couponModel.findOne({name: req.body.name}) 
  const cartDocument = await cartModel.findOne({user: req.user._id}) 

  if (!cartDocument) {
    return next(new apiError("no cart found to apply coupon", 404))
  }

  const discount = couponDocument.maxDiscount ?  
    (
      ((cartDocument.totalPrice * couponDocument.discountPercentage) / 100) > couponDocument.maxDiscount ?
      cartDocument.totalPrice - couponDocument.maxDiscount : 
      cartDocument.totalPrice - ((cartDocument.totalPrice * couponDocument.discountPercentage) / 100)
    )
    : 
    cartDocument.totalPrice - ((cartDocument.totalPrice * couponDocument.discountPercentage) / 100)

    cartDocument.totalPriceAfterDiscount = discount 

    await cartDocument.save() 

  res.status(201).json({
    data: cartDocument,
    status: 201
  })
})

