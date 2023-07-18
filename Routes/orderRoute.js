const express = require('express')
const { protectRoute, allowedTo } = require('../Controllers/authController')
const { createOrderValidation, getSpecificOrderValidation, updateIsDeliveredStatusValidation, updateIsPaidStatusValidation, deleteSpecificOrderValidation, stripeSessionValidation } = require('../Validators/orderValidatorRules')
const { createOrder, getLoggedUserOrders, getAllOrders, getSpecificOrder, updateIsDeliveredStatus, updateIsPaidStatus, deleteSpecificOrder, deleteAllOrders, stripeSession, updateSpecificOrderUpdatesField, deleteSpecificOrderUpdatesField } = require('../Controllers/orderController')

const orderRouter = express.Router()

orderRouter.post("/:cartID", protectRoute, allowedTo("user"), createOrderValidation, createOrder)
orderRouter.get("/", protectRoute, allowedTo("user"), getLoggedUserOrders)
orderRouter.get("/all-orders", protectRoute, allowedTo("admin"), getAllOrders)
orderRouter.get("/:orderID", protectRoute, allowedTo("admin", "user"), getSpecificOrderValidation, getSpecificOrder)
orderRouter.put("/is-delivered/:orderID", protectRoute, allowedTo("admin"), updateIsDeliveredStatusValidation, updateIsDeliveredStatus)
orderRouter.put("/is-paid/:orderID", protectRoute, allowedTo("admin"), updateIsPaidStatusValidation, updateIsPaidStatus)
orderRouter.delete("/delete-all-orders", protectRoute, allowedTo("admin"), deleteAllOrders) 
orderRouter.delete("/:orderID", protectRoute, allowedTo("admin", "user"), deleteSpecificOrderValidation, deleteSpecificOrder)
orderRouter.post("/online-payment-session/:cartID", protectRoute, allowedTo("user"), stripeSessionValidation, stripeSession)
orderRouter.put("/add-update/:orderID", protectRoute, allowedTo("admin"), updateSpecificOrderUpdatesField)
orderRouter.put("/delete-update/:orderID", protectRoute, allowedTo("admin"), deleteSpecificOrderUpdatesField)

module.exports = orderRouter