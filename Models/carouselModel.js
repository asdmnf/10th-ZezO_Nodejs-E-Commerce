const { default: mongoose } = require("mongoose");


const carouselSchema = new mongoose.Schema({
  backgroundColor: String,
  backgroundImage: String,
  foregroundImage: String,
  title: {
    type: String,
    trim: true
  },
  searchWord: {
    type: String,
    trim: true
  },
}, {timestamps: true})


carouselSchema.post("init", function(doc) {
  if (doc.backgroundImage) {
    const convertImageNameToURL = `${process.env.BASE_URL}/carousel/${doc.backgroundImage}`
    doc.backgroundImage = convertImageNameToURL
  }
  if (doc.foregroundImage) {
    const convertImageNameToURL = `${process.env.BASE_URL}/carousel/${doc.foregroundImage}`
    doc.foregroundImage = convertImageNameToURL
  }
})

const carouselModel = mongoose.model("Carousel", carouselSchema)

module.exports = carouselModel