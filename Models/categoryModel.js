const { default: mongoose } = require("mongoose")


// Schemas
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, 
        required: [true, 'Category Required'], 
        unique: [true, 'Category Must Be Unique'],
        minlength: [2, 'Category must be at least 2 characters long'],
        maxlength: [32, 'Category must be at most 32 characters long'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
}, {
    timestamps: true, 
})


categorySchema.post("init", function(doc) {
    if (doc.image) { 
        const convertImageNameToURL = `${process.env.BASE_URL}/categories/${doc.image}` 
        doc.image = convertImageNameToURL 
    }
    
})
categorySchema.post("save", function(doc) { 
    if (doc.image) {
        const convertImageNameToURL = `${process.env.BASE_URL}/categories/${doc.image}`
        doc.image = convertImageNameToURL
    }
    
})


// Models
const categoryModel = mongoose.model('category', categorySchema)

module.exports = categoryModel