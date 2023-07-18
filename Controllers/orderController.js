


const dotenv = require('dotenv')
dotenv.config({path: "config.env"})
const stripe = require('stripe')(process.env.STRIPE_SEKRET_KEY); 
const asyncHandler = require('express-async-handler')
const orderModel = require('../Models/orderModel')
const cartModel = require('../Models/cartModel')
const feesModel = require('../Models/feesModel')
const productModel = require('../Models/productModel')
const apiError = require('../Utils/apiError');
const { updateDocument } = require('../Utils/handlersFactory');




exports.createOrder = asyncHandler(async (req, res, next) => {
  const cartDocument = await cartModel.findOne({_id: req.params.cartID, user: req.user._id}) 
  const notEnoughtQuantitiyProducts = cartDocument.cartItems.filter(item => { 
      return item.product.quantity < item.quantity
  })
  if (notEnoughtQuantitiyProducts.length) { 
    const productId = notEnoughtQuantitiyProducts.map(item => { 
      return item.product._id 
    })
    return next(new apiError(`these products: ${productId} does not have enought quantity please wait to resupply or try to reduce quantity or contact admin`, 400))
  }




  const orderPrice = cartDocument.totalPriceAfterDiscount ? cartDocument.totalPriceAfterDiscount : cartDocument.totalPrice;



  const shippingAddress = req.user.addresses?.filter(item => {
    return item._id.toString() === req.body.shippingAddress
  })
  if(!shippingAddress) { 
    return next(new apiError("no addresses found for this user add one to continue", 404))
  }


    let cartItems = []
    cartDocument.cartItems.map(item => {
      cartItems.push({ 
        product: {
          _id: item.product._id.toString(),
          title: item.product.title,
          description: item.product.description,
          mainCategory: item.product.mainCategory.name,
          brand: item.product.brand.name,
          imageCover: item.product.imageCover,
          price: item.product.price,
          priceAfterDiscount: item.product.priceAfterDiscount,
        },
        quantity: item.quantity,
        color: item.color ? item.color : "",
        size: item.size ? item.size : "",
        itemPrice: item.itemPrice,
      })
    })

  const orderdocument = await orderModel.create({
    user: req.user._id,

    cartItems: cartItems,

    shippingAddress: {
      title: shippingAddress[0].title,
      fullAddress: shippingAddress[0].fullAddress,
      phone: shippingAddress[0].phone,
    },
    paymentMethod: req.body.paymentMethod,

    orderPrice: orderPrice - (cartDocument.shippingFees + cartDocument.taxFees),
    shippingFees: cartDocument.shippingFees,
    taxFees: cartDocument.taxFees,
    totalPayment: orderPrice,
  })

  if (!orderdocument) {
    return next(new apiError("failed to create order document", 404))
  }





  const bulkOption = cartDocument.cartItems.map(item => ({
    updateOne: { 
      filter: {_id: item.product._id}, 
      update: {$inc: {quantity: -item.quantity, sold: +item.quantity}} 
    }
  }))
  await productModel.bulkWrite(bulkOption) 

  await cartModel.findByIdAndDelete(req.params.cartID) 


  res.status(201).json({
    data: orderdocument,
    status: 201
  })
})

// get logged user orders
exports.getLoggedUserOrders = asyncHandler(async (req, res, next) => {
  const orderDocuments = await orderModel.find({user: req.user._id}).sort("-createdAt")

  if (!orderDocuments.length) {
    return next(new apiError("no orders founded", 404))
  }

  res.status(200).json({
    numberOfOrders: orderDocuments.length,
    data: orderDocuments,
    status: 200
  })
})

// get all orders
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orderDocuments = await orderModel.find().sort("-createdAt")

  if (!orderDocuments.length) {
    return next(new apiError("no orders founded", 404))
  }

  res.status(200).json({
    numberOfOrders: orderDocuments.length,
    data: orderDocuments,
    status: 200
  })
})

// get specific order
exports.getSpecificOrder = asyncHandler(async (req, res, next) => {
  const orderDocument = await orderModel.findById(req.params.orderID)

  if (!orderDocument) {
    return next(new apiError("specific order not found check your orderID",404))
  }

  res.status(200).json({
    data: orderDocument,
    status: 200
  })
})

// update is delivered status
exports.updateIsDeliveredStatus = asyncHandler(async (req, res, next) => {
  const orderDocument = await orderModel.findByIdAndUpdate(
    req.params.orderID,
    {
      isDelivered: req.body.isDelivered,
      deliveredDate: Date.now()
    },
    {new: true}
  )

  if (!orderDocument) {
    return next(new apiError("failed to update isDelevered status check orderID", 404))
  }

  if (req.body.isDelivered === false) {
    orderDocument.deliveredDate = undefined
    orderDocument.save()
  }

  res.status(201).json({
    data: orderDocument,
    status: 201
  })
})

// update is paid status
exports.updateIsPaidStatus = asyncHandler(async (req, res, next) => {
  const orderDocument = await orderModel.findByIdAndUpdate(
    req.params.orderID,
    {
      isPaid: req.body.isPaid,
      paidDate: Date.now()
    },
    {new: true}
  )

  if (!orderDocument) {
    return next(new apiError("failed to update isPaid status check orderID", 404))
  }

  if (req.body.isPaid === false) {
    orderDocument.paidDate = undefined
    orderDocument.save()
  }

  res.status(201).json({
    data: orderDocument,
    status: 201
  })
})

// update specific order
exports.updateSpecificOrderUpdatesField = asyncHandler(async (req, res, next) => {
  const document = await orderModel.findByIdAndUpdate(
    req.params.orderID,
    {
      $addToSet: {updates: {update: req.body.update, createdAt: Date.now()}}
    },
    {new: true}
    )
    if (!document) {
      return next(new apiError("cannot find order document check id order", 404))
    }
    res.status(201).json({
      data: document,
      status: 201
    })
})

exports.deleteSpecificOrderUpdatesField = asyncHandler(async (req, res, next) => {
  const document = await orderModel.findByIdAndUpdate(
    req.params.orderID,
    {
      $pull: {updates: {_id: req.body.updateID}}
    },
    {new: true}
    )
    if (!document) {
      return next(new apiError("cannot find order document check id order", 404))
    }
    res.status(200).json({
      data: "update delete successfully",
      status: 200
    })
})

// delete specific order - admin and user
exports.deleteSpecificOrder = asyncHandler(async (req, res, next) => {
  const orderDocument = await orderModel.findByIdAndDelete(req.params.orderID)
  if (!orderDocument) {
    return next(new apiError("failed to delete order document check orderID", 404))
  }
  res.status(200).json({
    data: "orderDocument deleted successfully",
    status: 200
  })
})

// delete all orders - admin only
exports.deleteAllOrders = asyncHandler(async (req, res, next) => {
  const orderDocuments = await orderModel.deleteMany()
  if (!orderDocuments) {
    return next(new apiError("failed to delete all order document may be there is no orders", 404))
  }
  res.status(200).json({
    data: "all orderDocuments deleted successfully",
    status: 200
  })
})


exports.stripeSession = asyncHandler(async (req, res, next) => {

  const cartDocument = await cartModel.findOne({_id: req.params.cartID, user: req.user._id}) 

  const notEnoughtQuantitiyProducts = cartDocument.cartItems.filter(item => {
      return item.product.quantity < item.quantity
  })
  if (notEnoughtQuantitiyProducts.length) {
    const productId = notEnoughtQuantitiyProducts.map(item => { 
      return item.product._id
    })
    return next(new apiError(`these products: ${productId} does not have enought quantity please wait to resupply or try to reduce quantity or contact admin`, 400))
  }


  
  const orderPrice = cartDocument.totalPriceAfterDiscount ? cartDocument.totalPriceAfterDiscount : cartDocument.totalPrice;




  const shippingAddress = req.user.addresses?.filter(item => {
    return item._id.toString() === req.body.shippingAddress
  })
  if(!shippingAddress) {
    return next(new apiError("no addresses found for this user add one to continue", 404))
  }



  const session = await stripe.checkout.sessions.create({


    line_items: [
      {
        price_data: {
          unit_amount: Math.round(orderPrice) * 100,
          currency: 'egp',
          product_data: {
            name: 'ZezO-test',
          },
        },
        quantity: 1,
      },
    ],

    mode: "payment",
    success_url: `http://localhost:3000/user/orders`, 
    cancel_url: `http://localhost:3000/cart`,
    metadata: { 
      cartID: req.params.cartID,
      userID: req.user._id.toString(), 
      shippingAddress_title: shippingAddress[0].title, 
      shippingAddress_fullAddress: shippingAddress[0].fullAddress,
      shippingAddress_phone: shippingAddress[0].phone,
    }, 
    client_reference_id: req.user._id.toString(),
    customer_email: req.user.email
  })
  if (!session) {
    return next(new apiError("failed to create session", 404))
  }
  res.status(201).json({
    session: session,
    status: 201
  })
})


exports.webHooksAndCreateOnlineOrder = asyncHandler(async (req, res, next) => {

  if (process.env.SRTIPE_WEBHOKKS_ENDPOINT_SECRET) { 
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature']; 
    let event;

  try { 
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.SRTIPE_WEBHOKKS_ENDPOINT_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

    if (event.type === "checkout.session.completed") {

    const cartDocument = await cartModel.findOne({_id: event.data.object.metadata.cartID, user: event.data.object.client_reference_id})


    const orderPrice = cartDocument.totalPriceAfterDiscount ? cartDocument.totalPriceAfterDiscount : cartDocument.totalPrice;

  let cartItems = []
  cartDocument.cartItems.map(item => {
    cartItems.push({
      product: {
        _id: item.product._id.toString(),
        title: item.product.title,
        description: item.product.description,
        mainCategory: item.product.mainCategory.name,
        brand: item.product.brand.name,
        imageCover: item.product.imageCover,
        price: item.product.price,
        priceAfterDiscount: item.product.priceAfterDiscount,
      },
      quantity: item.quantity,
      color: item.color ? item.color : "",
      size: item.size ? item.size : "",
      itemPrice: item.itemPrice,
    })
  })

      const orderdocument = await orderModel.create({
        user: event.data.object.client_reference_id,

        cartItems: cartItems,
        shippingAddress: {
          title: event.data.object.metadata.shippingAddress_title,
          fullAddress: event.data.object.metadata.shippingAddress_fullAddress,
          phone: event.data.object.metadata.shippingAddress_phone,
        },
        paymentMethod: "visa",

        orderPrice: orderPrice - (cartDocument.shippingFees + cartDocument.taxFees),
        shippingFees: cartDocument.shippingFees,
        taxFees: cartDocument.taxFees,
        totalPayment: event.data.object.amount_total / 100,
        isPaid: true,
        paidDate: Date.now(),
      })
    
      if (!orderdocument) {
        return next(new apiError("failed to create order document", 404))
      }
      const bulkOption = cartDocument.cartItems.map(item => ({
        updateOne: {
          filter: {_id: item.product._id},
          update: {$inc: {quantity: -item.quantity, sold: +item.quantity}}
        }
      }))
      await productModel.bulkWrite(bulkOption)
    
      await cartModel.findByIdAndDelete(event.data.object.metadata.cartID)
      res.status(201).json({
        msg: "payment received successfully",
        data: orderdocument,
        status: 201
      })
    }
  }
})