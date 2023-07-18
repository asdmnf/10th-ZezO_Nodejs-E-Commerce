const couponModel = require("../Models/couponModel");
const { createDocument, getAllDocuments, getOneDocument, updateDocument, deleteDocument } = require("../Utils/handlersFactory");


exports.createCoupon = createDocument(couponModel)

exports.getAllCoupons = getAllDocuments(couponModel)

exports.getSpecificCoupon = getOneDocument(couponModel)

exports.updateSpecificCoupon = updateDocument(couponModel)

exports.deleteSpecificcoupon = deleteDocument(couponModel)