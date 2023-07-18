

const asyncHandler = require('express-async-handler')
const { default: slugify } = require('slugify')
const apiError = require("./apiError")
const ApiFeatures = require('./apiFeatures')
const fs = require('fs')
const userModel = require('../Models/userModel')

exports.deleteAllDocument = (model) => {
  return asyncHandler( async (req, res, next) => {
    const documents = await model.deleteMany()
    if (!documents) {
      return next(new apiError("failed to delete all documents may be there is no documents", 404))
    }
    res.status(200).json({
      data: "all documents deleted successfully",
      status: 200
    })
  } )
}

exports.deleteDocument = (model) => {
  return asyncHandler( async (req, res, next) => {

    //------------------------------------------------------------------------------------------------------------------
    // Protected Content
    const protectedIDs = [
      // allCategories
      '64752b5463effaf07fabf9a3',
      '64713542b41ddc7f693d1939',
      '64713003b41ddc7f693d17e6',
      '647126eeb41ddc7f693d15f2',
      '6471268cb41ddc7f693d15ce',
      '646bfb4caaefb53bb4a51ea8',
      '646963133bceab474e0122fd',
      '6466be98de0a035fda036340',
      '646402b6112a846cfcecc97c',
      // allSubCategories
      '6477cf1251248853313c836a',
      '647536d663effaf07fabfdbf',
      '6475323f63effaf07fabfb65',
      '64752b9e63effaf07fabf9af',
      '64752b9163effaf07fabf9aa',
      '64713636b41ddc7f693d1947',
      '64713027b41ddc7f693d17f2',
      '6471301db41ddc7f693d17ed',
      '6471270bb41ddc7f693d15fe',
      '64712700b41ddc7f693d15f9',
      '646bfb67aaefb53bb4a51eb4',
      '646bfb5eaaefb53bb4a51eaf',
      '646963733bceab474e012318',
      '6469636d3bceab474e012313',
      '6469635c3bceab474e01230e',
      '646963563bceab474e012309',
      '646963283bceab474e012304',
      '64694afc3bceab474e011df4',
      '646949c33bceab474e011d98',
      '646945383bceab474e011cf1',
      '646944bd3bceab474e011ce8',
      '646944b63bceab474e011ce3',
      '646944ad3bceab474e011cde',
      '646944a43bceab474e011cd9',
      '6464035b112a846cfcecc9ac',
      '64640353112a846cfcecc9a7',
      '64640336112a846cfcecc998',
      '64640326112a846cfcecc993',
      // allBrands
      '64752b0063effaf07fabf99c',
      '64752ae963effaf07fabf997',
      '64752adf63effaf07fabf992',
      '64752acc63effaf07fabf98d',
      '6471333fb41ddc7f693d18c7',
      '64712f93b41ddc7f693d17e1',
      '6471242fb41ddc7f693d1428',
      '64712424b41ddc7f693d1423',
      '64712413b41ddc7f693d141e',
      '646c0378aaefb53bb4a51f54',
      '646c0002aaefb53bb4a51ebe',
      '646bfbdfaaefb53bb4a51eb9',
      '646960d63bceab474e0122f6',
      '646960c53bceab474e0122f1',
      '646960b23bceab474e0122ec',
      '6466c2fbde0a035fda036371',
      '6466c29dde0a035fda03636c',
      '6466c28ade0a035fda036367',
      '6466c281de0a035fda036362',
      '6466c273de0a035fda03635d',
      '6466c26ade0a035fda036358',
      '6466c00dde0a035fda036353',
      '64641ef4112a846cfceccf88',
      '646416c1112a846cfceccf27',
      '64641398112a846cfcecced3',
      '64641230112a846cfcecce6e',
      '6464093f112a846cfceccb1c',
      '646408d3112a846cfceccafe',
      '646406da112a846cfcecca82',
      '646405c4112a846cfcecc9d5',
      '646404d9112a846cfcecc9b7',
      // allCarousel
      '64753f75a5f6512204755b2e',
      '64753ef5a5f6512204755b24',
      '64753d3363effaf07fac01e8',
      '64753ba363effaf07fac0134',
      '6471342db41ddc7f693d1934',
      '647130dcb41ddc7f693d1855',
      '64712b85b41ddc7f693d1752',
      '646bf9f1aaefb53bb4a51e9b',
      '646967d73bceab474e012482',
      // allCoupons
      '6475485ca5f6512204755c02',
      '646c08e6aaefb53bb4a521dd',
      // allProducts
      // '6477cfd651248853313c83b6',
      // '6477cf5b51248853313c8396',
      // '6477ce2451248853313c8309',
      // '64753ab463effaf07fac0072',
      // '64753a2f63effaf07fac0052',
      // '647539b863effaf07fac0032',
      // '647538e963effaf07fabffad',
      // '6475389463effaf07fabff8d',
      // '6475375b63effaf07fabfe2f',
      // '647536c163effaf07fabfd82',
      // '6475362763effaf07fabfd62',
      // '647535af63effaf07fabfd42',
      // '647534e063effaf07fabfcfe',
      // '6475347063effaf07fabfcde',
      // '6475342563effaf07fabfcbe',
      // '647533ae63effaf07fabfc9e',
      // '6475334963effaf07fabfc19',
      // '647532ca63effaf07fabfb8f',
      // '6475321763effaf07fabfb47',
      // '647531ac63effaf07fabfb27',
      // '6475308c63effaf07fabfa8c',
      // '64752f0763effaf07fabfa6c',
      // '64752e2d63effaf07fabfa23',
      // '64752d1063effaf07fabf9da',
      // '64752c7e63effaf07fabf9ba',
      // '64713a38b41ddc7f693d1baa',
      // '647139c8b41ddc7f693d1b69',
      // '6471393bb41ddc7f693d1b17',
      // '647138b8b41ddc7f693d1aaa',
      // '647137e9b41ddc7f693d19db',
      // '6471377db41ddc7f693d1998',
      // '64713716b41ddc7f693d1957',
      // '647132a3b41ddc7f693d18ab',
      // '64713213b41ddc7f693d188b',
      // '647131bab41ddc7f693d186b',
      // '6471308eb41ddc7f693d1802',
      // '64712d04b41ddc7f693d17ad',
      // '64712c02b41ddc7f693d1762',
      // '64712abfb41ddc7f693d16f0',
      // '647129aeb41ddc7f693d16ce',
      // '647128b2b41ddc7f693d1675',
      // '647127f2b41ddc7f693d160e',
      // '646c0668aaefb53bb4a52008',
      // '646c05dbaaefb53bb4a51fe8',
      // '646c051baaefb53bb4a51fc8',
      // '646c0485aaefb53bb4a51fa3',
      // '646c03feaaefb53bb4a51f83',
      // '646c02b3aaefb53bb4a51eee',
      // '646c022aaaefb53bb4a51ece',
      // '6469678b3bceab474e01246c',
      // '6469670b3bceab474e012452',
      // '646966733bceab474e012419',
      // '646965f43bceab474e0123ff',
      // '6469652c3bceab474e0123db',
      // '646964823bceab474e01235c',
      // '646963d53bceab474e012323',
      // '64695ab23bceab474e012236',
      // '64695a343bceab474e01221c',
      // '646959cb3bceab474e012202',
      // '646959693bceab474e0121e8',
      // '646958e73bceab474e0121ce',
      // '646958773bceab474e0121b4',
      // '646958133bceab474e01219a',
      // '646957913bceab474e01217b',
      // '646957543bceab474e012161',
      // '646956db3bceab474e012147',
      // '646956753bceab474e01212d',
      // '646956133bceab474e012113',
      // '646955a93bceab474e0120f9',
      // '646955373bceab474e0120df',
      // '646954b53bceab474e0120c5',
      // '646954503bceab474e0120ab',
      // '646953fc3bceab474e012091',
      // '646952a43bceab474e011ff7',
      // '646952093bceab474e011fdd',
      // '6469513b3bceab474e011fbe',
      // '646950b23bceab474e011fa4',
      // '646950233bceab474e011f8a',
      // '64694fc03bceab474e011f70',
      // '64694e7f3bceab474e011f29',
      // '64694e1e3bceab474e011f0f',
      // '64694d793bceab474e011ef5',
      // '64694ce23bceab474e011edb',
      // '64694bfa3bceab474e011e6d',
      // '64694b493bceab474e011dff',
      // '64694a853bceab474e011da3',
      // '646946be3bceab474e011d2f',
      // '646946523bceab474e011cfc',
      // '64642195112a846cfcecd0ce',
      // '64642164112a846cfcecd0b7',
      // '64641f96112a846cfceccfaa',
      // '64641f41112a846cfceccf93',
      // '64641729112a846cfceccf49',
      // '646416e2112a846cfceccf32',
      // '6464142a112a846cfceccefa',
      // '646413df112a846cfceccede',
      // '646412f0112a846cfcecce9e',
      // '64641278112a846cfcecce79',
      // '646411ed112a846cfcecce5b',
      // '64640fbe112a846cfcecce03',
      // '64640f7b112a846cfceccdec',
      // '64640f2c112a846cfceccdd5',
      // '64640eec112a846cfceccdbe',
      // '64640e90112a846cfceccda7',
      // '64640e51112a846cfceccd90',
      // '64640e00112a846cfceccd61',
      // '64640c45112a846cfceccc41',
      // '64640be5112a846cfceccc12',
      // '64640b5a112a846cfceccbe3',
      // '64640ae8112a846cfceccbb4',
      // '64640a9d112a846cfceccb85',
      // '64640a19112a846cfceccb56',
      // '6464099a112a846cfceccb27',
      // '64640905112a846cfceccb09',
      // '6464086f112a846cfceccaeb',
      // '646407f0112a846cfceccabc',
      // '64640754112a846cfcecca8d',
      // '646405fc112a846cfcecc9e0',
      // '64640538112a846cfcecc9c2',
      // allUsers
      '64a48dbaac0fc05114b51797',
      '64a48caeac0fc05114b51648',
      '64a48ba3ac0fc05114b514df',
      '64a48a5cac0fc05114b51360',
      '64a486afac0fc05114b51127',
      '646aa125492aad83e1cf5260',
      '6463fdb2112a846cfcecc91e' ,
      // allReviews
      '64a48473ac0fc05114b50f6f',
      '64a484c2ac0fc05114b50fbe',
      '64a485ccac0fc05114b5106b',
      '64a4871bac0fc05114b51140',
      '64a4896fac0fc05114b51282',
      '64a489f3ac0fc05114b512fa',
      '64a48a91ac0fc05114b51379',
      '64a48b0eac0fc05114b5144b',
      '64a48b3fac0fc05114b51494',
      '64a48bd9ac0fc05114b51509',
      '64a48c22ac0fc05114b515c9',
      '64a48ce9ac0fc05114b51671',
      '64a48d6dac0fc05114b51769',
      '64a48e50ac0fc05114b517c1',
        ]
    
        if (protectedIDs.includes(req.params.id)) {
          return next(new apiError("protected content! only new content can be deleted", 500))
        }
    
        //------------------------------------------------------------------------------------------------------------------

    const id = req.params.id
    const document = await model.findOneAndDelete({_id: id})
    if (!document) {
      return next(new apiError("Invalid document id", 400))
    }



    const deleteImageRelatedToDocument = async (field) => {
      try {
        fs.unlinkSync(`uploads/${field.split("/")[3]}/${field.split("/")[4]}`) 
      } catch (err) {
        console.log(err)
      }
    }
    if (document.image) {
      deleteImageRelatedToDocument(document.image)
    }
    if (document.imageCover) {
      deleteImageRelatedToDocument(document.imageCover)
    }
    if (document.iamgesGallery?.length) {
      document.iamgesGallery.map(item => {
        deleteImageRelatedToDocument(item)
      })
    }


    res.status(200).json({
      data: "document Deleted Successfully",
      status: 200
    })
  } )
}

exports.updateDocument = (model) => {
  return asyncHandler( async (req, res, next) => {


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



    if (req.body.name) {
      req.body.slug = slugify(req.body.name)
    }
  
    const document = await model.findOneAndUpdate(
      {_id: id},
      req.body, 
      {new: true}
      )
    if (!document) {
      return next(new apiError("Invalid document id", 400))
    }




    res.status(201).json({
      data: document,
      status: 201
    })
  } )
}

exports.getOneDocument = (model, populateOption) => { 
  return asyncHandler( async (req, res, next) => {

    //------------------------------------------------------------------------------------------------------------------
    // Protected Content
    const protectedIDs = [
  // allCategories
  '64752b5463effaf07fabf9a3',
  '64713542b41ddc7f693d1939',
  '64713003b41ddc7f693d17e6',
  '647126eeb41ddc7f693d15f2',
  '6471268cb41ddc7f693d15ce',
  '646bfb4caaefb53bb4a51ea8',
  '646963133bceab474e0122fd',
  '6466be98de0a035fda036340',
  '646402b6112a846cfcecc97c',
  // allSubCategories
  '6477cf1251248853313c836a',
  '647536d663effaf07fabfdbf',
  '6475323f63effaf07fabfb65',
  '64752b9e63effaf07fabf9af',
  '64752b9163effaf07fabf9aa',
  '64713636b41ddc7f693d1947',
  '64713027b41ddc7f693d17f2',
  '6471301db41ddc7f693d17ed',
  '6471270bb41ddc7f693d15fe',
  '64712700b41ddc7f693d15f9',
  '646bfb67aaefb53bb4a51eb4',
  '646bfb5eaaefb53bb4a51eaf',
  '646963733bceab474e012318',
  '6469636d3bceab474e012313',
  '6469635c3bceab474e01230e',
  '646963563bceab474e012309',
  '646963283bceab474e012304',
  '64694afc3bceab474e011df4',
  '646949c33bceab474e011d98',
  '646945383bceab474e011cf1',
  '646944bd3bceab474e011ce8',
  '646944b63bceab474e011ce3',
  '646944ad3bceab474e011cde',
  '646944a43bceab474e011cd9',
  '6464035b112a846cfcecc9ac',
  '64640353112a846cfcecc9a7',
  '64640336112a846cfcecc998',
  '64640326112a846cfcecc993',
  // allBrands
  '64752b0063effaf07fabf99c',
  '64752ae963effaf07fabf997',
  '64752adf63effaf07fabf992',
  '64752acc63effaf07fabf98d',
  '6471333fb41ddc7f693d18c7',
  '64712f93b41ddc7f693d17e1',
  '6471242fb41ddc7f693d1428',
  '64712424b41ddc7f693d1423',
  '64712413b41ddc7f693d141e',
  '646c0378aaefb53bb4a51f54',
  '646c0002aaefb53bb4a51ebe',
  '646bfbdfaaefb53bb4a51eb9',
  '646960d63bceab474e0122f6',
  '646960c53bceab474e0122f1',
  '646960b23bceab474e0122ec',
  '6466c2fbde0a035fda036371',
  '6466c29dde0a035fda03636c',
  '6466c28ade0a035fda036367',
  '6466c281de0a035fda036362',
  '6466c273de0a035fda03635d',
  '6466c26ade0a035fda036358',
  '6466c00dde0a035fda036353',
  '64641ef4112a846cfceccf88',
  '646416c1112a846cfceccf27',
  '64641398112a846cfcecced3',
  '64641230112a846cfcecce6e',
  '6464093f112a846cfceccb1c',
  '646408d3112a846cfceccafe',
  '646406da112a846cfcecca82',
  '646405c4112a846cfcecc9d5',
  '646404d9112a846cfcecc9b7',
  // allCarousel
  '64753f75a5f6512204755b2e',
  '64753ef5a5f6512204755b24',
  '64753d3363effaf07fac01e8',
  '64753ba363effaf07fac0134',
  '6471342db41ddc7f693d1934',
  '647130dcb41ddc7f693d1855',
  '64712b85b41ddc7f693d1752',
  '646bf9f1aaefb53bb4a51e9b',
  '646967d73bceab474e012482',
  // allCoupons
  '6475485ca5f6512204755c02',
  '646c08e6aaefb53bb4a521dd',
  // allProducts
  // '6477cfd651248853313c83b6',
  // '6477cf5b51248853313c8396',
  // '6477ce2451248853313c8309',
  // '64753ab463effaf07fac0072',
  // '64753a2f63effaf07fac0052',
  // '647539b863effaf07fac0032',
  // '647538e963effaf07fabffad',
  // '6475389463effaf07fabff8d',
  // '6475375b63effaf07fabfe2f',
  // '647536c163effaf07fabfd82',
  // '6475362763effaf07fabfd62',
  // '647535af63effaf07fabfd42',
  // '647534e063effaf07fabfcfe',
  // '6475347063effaf07fabfcde',
  // '6475342563effaf07fabfcbe',
  // '647533ae63effaf07fabfc9e',
  // '6475334963effaf07fabfc19',
  // '647532ca63effaf07fabfb8f',
  // '6475321763effaf07fabfb47',
  // '647531ac63effaf07fabfb27',
  // '6475308c63effaf07fabfa8c',
  // '64752f0763effaf07fabfa6c',
  // '64752e2d63effaf07fabfa23',
  // '64752d1063effaf07fabf9da',
  // '64752c7e63effaf07fabf9ba',
  // '64713a38b41ddc7f693d1baa',
  // '647139c8b41ddc7f693d1b69',
  // '6471393bb41ddc7f693d1b17',
  // '647138b8b41ddc7f693d1aaa',
  // '647137e9b41ddc7f693d19db',
  // '6471377db41ddc7f693d1998',
  // '64713716b41ddc7f693d1957',
  // '647132a3b41ddc7f693d18ab',
  // '64713213b41ddc7f693d188b',
  // '647131bab41ddc7f693d186b',
  // '6471308eb41ddc7f693d1802',
  // '64712d04b41ddc7f693d17ad',
  // '64712c02b41ddc7f693d1762',
  // '64712abfb41ddc7f693d16f0',
  // '647129aeb41ddc7f693d16ce',
  // '647128b2b41ddc7f693d1675',
  // '647127f2b41ddc7f693d160e',
  // '646c0668aaefb53bb4a52008',
  // '646c05dbaaefb53bb4a51fe8',
  // '646c051baaefb53bb4a51fc8',
  // '646c0485aaefb53bb4a51fa3',
  // '646c03feaaefb53bb4a51f83',
  // '646c02b3aaefb53bb4a51eee',
  // '646c022aaaefb53bb4a51ece',
  // '6469678b3bceab474e01246c',
  // '6469670b3bceab474e012452',
  // '646966733bceab474e012419',
  // '646965f43bceab474e0123ff',
  // '6469652c3bceab474e0123db',
  // '646964823bceab474e01235c',
  // '646963d53bceab474e012323',
  // '64695ab23bceab474e012236',
  // '64695a343bceab474e01221c',
  // '646959cb3bceab474e012202',
  // '646959693bceab474e0121e8',
  // '646958e73bceab474e0121ce',
  // '646958773bceab474e0121b4',
  // '646958133bceab474e01219a',
  // '646957913bceab474e01217b',
  // '646957543bceab474e012161',
  // '646956db3bceab474e012147',
  // '646956753bceab474e01212d',
  // '646956133bceab474e012113',
  // '646955a93bceab474e0120f9',
  // '646955373bceab474e0120df',
  // '646954b53bceab474e0120c5',
  // '646954503bceab474e0120ab',
  // '646953fc3bceab474e012091',
  // '646952a43bceab474e011ff7',
  // '646952093bceab474e011fdd',
  // '6469513b3bceab474e011fbe',
  // '646950b23bceab474e011fa4',
  // '646950233bceab474e011f8a',
  // '64694fc03bceab474e011f70',
  // '64694e7f3bceab474e011f29',
  // '64694e1e3bceab474e011f0f',
  // '64694d793bceab474e011ef5',
  // '64694ce23bceab474e011edb',
  // '64694bfa3bceab474e011e6d',
  // '64694b493bceab474e011dff',
  // '64694a853bceab474e011da3',
  // '646946be3bceab474e011d2f',
  // '646946523bceab474e011cfc',
  // '64642195112a846cfcecd0ce',
  // '64642164112a846cfcecd0b7',
  // '64641f96112a846cfceccfaa',
  // '64641f41112a846cfceccf93',
  // '64641729112a846cfceccf49',
  // '646416e2112a846cfceccf32',
  // '6464142a112a846cfceccefa',
  // '646413df112a846cfceccede',
  // '646412f0112a846cfcecce9e',
  // '64641278112a846cfcecce79',
  // '646411ed112a846cfcecce5b',
  // '64640fbe112a846cfcecce03',
  // '64640f7b112a846cfceccdec',
  // '64640f2c112a846cfceccdd5',
  // '64640eec112a846cfceccdbe',
  // '64640e90112a846cfceccda7',
  // '64640e51112a846cfceccd90',
  // '64640e00112a846cfceccd61',
  // '64640c45112a846cfceccc41',
  // '64640be5112a846cfceccc12',
  // '64640b5a112a846cfceccbe3',
  // '64640ae8112a846cfceccbb4',
  // '64640a9d112a846cfceccb85',
  // '64640a19112a846cfceccb56',
  // '6464099a112a846cfceccb27',
  // '64640905112a846cfceccb09',
  // '6464086f112a846cfceccaeb',
  // '646407f0112a846cfceccabc',
  // '64640754112a846cfcecca8d',
  // '646405fc112a846cfcecc9e0',
  // '64640538112a846cfcecc9c2',
  // allUsers
  '64a48dbaac0fc05114b51797',
  '64a48caeac0fc05114b51648',
  '64a48ba3ac0fc05114b514df',
  '64a48a5cac0fc05114b51360',
  '64a486afac0fc05114b51127',
  '646aa125492aad83e1cf5260',
  '6463fdb2112a846cfcecc91e' ,
  // allReviews
  '64a48473ac0fc05114b50f6f',
  '64a484c2ac0fc05114b50fbe',
  '64a485ccac0fc05114b5106b',
  '64a4871bac0fc05114b51140',
  '64a4896fac0fc05114b51282',
  '64a489f3ac0fc05114b512fa',
  '64a48a91ac0fc05114b51379',
  '64a48b0eac0fc05114b5144b',
  '64a48b3fac0fc05114b51494',
  '64a48bd9ac0fc05114b51509',
  '64a48c22ac0fc05114b515c9',
  '64a48ce9ac0fc05114b51671',
  '64a48d6dac0fc05114b51769',
  '64a48e50ac0fc05114b517c1',
    ]

    if (protectedIDs.includes(req.params.id)) {
      return next(new apiError("protected content! only new content can be deleted", 500))
    }

    //------------------------------------------------------------------------------------------------------------------


    const id = req.params.id

    
    let query = model.findById(id) 
    if (populateOption) { 
      query = model.findById(id).populate(populateOption)
    }
    
    const document = await query 
  
    if (!document) {
      return next(new apiError("Invalid document id", 400))
    }
    res.status(200).json({ 
      data: model === userModel ? { 
        _id: document._id,
        name: document.name,
        slug: document.slug,
        email: document.email,
        phone: document.phone,
        role: document.role,
        active: document.active,
      }
      : document,
      status: 200
    })
  } )
}

exports.getAllDocuments = (model, modelName) => {
  return asyncHandler( async (req, res) => {
    const maincategoryid = req.params.maincategoryid 
    const categoryIdForProducts = req.params.categoryIdForProducts 
    const subCategoryIdForProducts = req.params.subCategoryIdForProducts 
    const brandIdForProducts = req.params.brandIdForProducts 
    const productIdforReviews = req.params.productIdforReviews


    const apiFeatures = new ApiFeatures(model.find( 
      maincategoryid ? {mainCategory: maincategoryid} : 
      categoryIdForProducts? {mainCategory: categoryIdForProducts} : 
      subCategoryIdForProducts? {subCategory: subCategoryIdForProducts} : 
      brandIdForProducts? {brand: brandIdForProducts} : 
      productIdforReviews? {product: productIdforReviews} : 
      {}), req.query)
    .filteration().sorting().fieldsLimitation().searching(modelName)


    const allResults = await model.countDocuments(apiFeatures.mongooseQuery) 
    apiFeatures.pagination(allResults) 

    const document = await apiFeatures.mongooseQuery
    res.status(200).json({ 
      results: document.length,
      paginationData: apiFeatures.paginationData,
      data: model === userModel ? 
        document.map(item => { 
          return {
            _id: item._id,
            name: item.name,
            slug: item.slug,
            email: item.email,
            phone: item.phone,
            role: item.role,
            active: item.active,
          }
        })
      : document,
      status: 200,
    })

})
}

exports.createDocument = (model) => {
  return asyncHandler( async (req, res, next) => {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title) 
    }
    if (req.body.name) {
      req.body.slug = slugify(req.body.name) 
    }
    const document = await model.create(req.body)
    res.status(201).json({ 
      data: model === userModel ? { 
        _id: document._id,
        name: document.name,
        slug: document.slug,
        email: document.email,
        phone: document.phone,
        role: document.role,
        active: document.active,
      }
      : document,
      status: 201
    })
  } )
  
}