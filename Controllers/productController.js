const asyncHandler = require('express-async-handler');
const { default: slugify } = require('slugify');
const productModel = require('../Models/productModel');
const wishlistModel = require('../Models/wishlistModel');
const orderModel = require('../Models/orderModel');
const apiError = require('../Utils/apiError');
const ApiFeatures = require('../Utils/apiFeatures');
const { deleteDocument, updateDocument, getOneDocument, getAllDocuments, createDocument, deleteAllDocument } = require('../Utils/handlersFactory');

const sharp = require("sharp")
const { v4: uuidv4 } = require('uuid');
const { multerMixImagesUpload } = require('../Middlewares/imageUploadMiddleware');

exports.productUploadMixImagesByMulter = multerMixImagesUpload("imageCover", "iamgesGallery")

exports.productImageProccessingBySharp = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const filename = `products-cover-${uuidv4()}-${Date.now()}.png`

    await sharp(req.files.imageCover[0].buffer)
    // .toFormat("jpeg")
    .png({quality: 80})
    .toFile(`uploads/products/${filename}`)

    req.body.imageCover = filename
    }
  
  if (req.files.iamgesGallery) {

    const iamgesGalleryNames = []


    if (req.body.iamgesGallery) {
      if (Array.isArray(req.body.iamgesGallery)) {
        req.body.iamgesGallery.map(item => {
          iamgesGalleryNames.push(item)
        })
      } else {
        iamgesGalleryNames.push(req.body.iamgesGallery)
      }
    }
    
    await Promise.all(
      req.files.iamgesGallery.map(async (item, index) => {
        const filename = `products-gallery-${uuidv4()}-${Date.now()}-${index + 1}.png`
        await sharp(item.buffer)
        // .toFormat("jpeg")
        .png({quality: 80})
        .toFile(`uploads/products/${filename}`)

        iamgesGalleryNames.push(filename)
      })
    )
    req.body.iamgesGallery = iamgesGalleryNames 
  }

  next()
} )


exports.createProduct = createDocument(productModel)



exports.getAllProducts = getAllDocuments(productModel, "productModel") 




exports.getSpecificProduct = getOneDocument(productModel, "reviews") 

exports.updateSpecificProduct = updateDocument(productModel)




exports.deleteSpecificProduct = asyncHandler( async (req, res, next) => {



  //------------------------------------------------------------------------------------------------------------------
  // Protected Content
  const protectedIDs = [
    // allProducts
  '6477cfd651248853313c83b6',
  '6477cf5b51248853313c8396',
  '6477ce2451248853313c8309',
  '64753ab463effaf07fac0072',
  '64753a2f63effaf07fac0052',
  '647539b863effaf07fac0032',
  '647538e963effaf07fabffad',
  '6475389463effaf07fabff8d',
  '6475375b63effaf07fabfe2f',
  '647536c163effaf07fabfd82',
  '6475362763effaf07fabfd62',
  '647535af63effaf07fabfd42',
  '647534e063effaf07fabfcfe',
  '6475347063effaf07fabfcde',
  '6475342563effaf07fabfcbe',
  '647533ae63effaf07fabfc9e',
  '6475334963effaf07fabfc19',
  '647532ca63effaf07fabfb8f',
  '6475321763effaf07fabfb47',
  '647531ac63effaf07fabfb27',
  '6475308c63effaf07fabfa8c',
  '64752f0763effaf07fabfa6c',
  '64752e2d63effaf07fabfa23',
  '64752d1063effaf07fabf9da',
  '64752c7e63effaf07fabf9ba',
  '64713a38b41ddc7f693d1baa',
  '647139c8b41ddc7f693d1b69',
  '6471393bb41ddc7f693d1b17',
  '647138b8b41ddc7f693d1aaa',
  '647137e9b41ddc7f693d19db',
  '6471377db41ddc7f693d1998',
  '64713716b41ddc7f693d1957',
  '647132a3b41ddc7f693d18ab',
  '64713213b41ddc7f693d188b',
  '647131bab41ddc7f693d186b',
  '6471308eb41ddc7f693d1802',
  '64712d04b41ddc7f693d17ad',
  '64712c02b41ddc7f693d1762',
  '64712abfb41ddc7f693d16f0',
  '647129aeb41ddc7f693d16ce',
  '647128b2b41ddc7f693d1675',
  '647127f2b41ddc7f693d160e',
  '646c0668aaefb53bb4a52008',
  '646c05dbaaefb53bb4a51fe8',
  '646c051baaefb53bb4a51fc8',
  '646c0485aaefb53bb4a51fa3',
  '646c03feaaefb53bb4a51f83',
  '646c02b3aaefb53bb4a51eee',
  '646c022aaaefb53bb4a51ece',
  '6469678b3bceab474e01246c',
  '6469670b3bceab474e012452',
  '646966733bceab474e012419',
  '646965f43bceab474e0123ff',
  '6469652c3bceab474e0123db',
  '646964823bceab474e01235c',
  '646963d53bceab474e012323',
  '64695ab23bceab474e012236',
  '64695a343bceab474e01221c',
  '646959cb3bceab474e012202',
  '646959693bceab474e0121e8',
  '646958e73bceab474e0121ce',
  '646958773bceab474e0121b4',
  '646958133bceab474e01219a',
  '646957913bceab474e01217b',
  '646957543bceab474e012161',
  '646956db3bceab474e012147',
  '646956753bceab474e01212d',
  '646956133bceab474e012113',
  '646955a93bceab474e0120f9',
  '646955373bceab474e0120df',
  '646954b53bceab474e0120c5',
  '646954503bceab474e0120ab',
  '646953fc3bceab474e012091',
  '646952a43bceab474e011ff7',
  '646952093bceab474e011fdd',
  '6469513b3bceab474e011fbe',
  '646950b23bceab474e011fa4',
  '646950233bceab474e011f8a',
  '64694fc03bceab474e011f70',
  '64694e7f3bceab474e011f29',
  '64694e1e3bceab474e011f0f',
  '64694d793bceab474e011ef5',
  '64694ce23bceab474e011edb',
  '64694bfa3bceab474e011e6d',
  '64694b493bceab474e011dff',
  '64694a853bceab474e011da3',
  '646946be3bceab474e011d2f',
  '646946523bceab474e011cfc',
  '64642195112a846cfcecd0ce',
  '64642164112a846cfcecd0b7',
  '64641f96112a846cfceccfaa',
  '64641f41112a846cfceccf93',
  '64641729112a846cfceccf49',
  '646416e2112a846cfceccf32',
  '6464142a112a846cfceccefa',
  '646413df112a846cfceccede',
  '646412f0112a846cfcecce9e',
  '64641278112a846cfcecce79',
  '646411ed112a846cfcecce5b',
  '64640fbe112a846cfcecce03',
  '64640f7b112a846cfceccdec',
  '64640f2c112a846cfceccdd5',
  '64640eec112a846cfceccdbe',
  '64640e90112a846cfceccda7',
  '64640e51112a846cfceccd90',
  '64640e00112a846cfceccd61',
  '64640c45112a846cfceccc41',
  '64640be5112a846cfceccc12',
  '64640b5a112a846cfceccbe3',
  '64640ae8112a846cfceccbb4',
  '64640a9d112a846cfceccb85',
  '64640a19112a846cfceccb56',
  '6464099a112a846cfceccb27',
  '64640905112a846cfceccb09',
  '6464086f112a846cfceccaeb',
  '646407f0112a846cfceccabc',
  '64640754112a846cfcecca8d',
  '646405fc112a846cfcecc9e0',
  '64640538112a846cfcecc9c2',
  ]

  if (protectedIDs.includes(req.params.id)) {
    return next(new apiError("protected content! only new content can be deleted", 500))
  }

  //------------------------------------------------------------------------------------------------------------------



  const id = req.params.id
  const document = await productModel.findOneAndDelete({_id: id})
  if (!document) {
    return next(new apiError("Invalid document id", 400))
  }


  await wishlistModel.findOneAndDelete({product: id})




  res.status(200).json({
    data: "document Deleted Successfully",
    status: 200
  })
} )


// delete all products
exports.deleteAllProducts = deleteAllDocument(productModel)