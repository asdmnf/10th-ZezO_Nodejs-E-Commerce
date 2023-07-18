const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const DBConnection = require('./Config/dbConnection');
const categoryRouter = require("./Routes/categoryRoute");
const apiError = require('./Utils/apiError');
const errorStoreMiddleware = require('./Middlewares/errorStoreMiddleware');
const subCategoryRouter = require('./Routes/subCategoryRoute');
const brandRouter = require('./Routes/brandRoute');
const productRouter = require('./Routes/productRoute');
const userRouter = require('./Routes/userRoute');
const authRouter = require('./Routes/authRoute');
const loggedUserRouter = require('./Routes/loggedUserRoute');
const reviewRouter = require('./Routes/reviewRoute');
const wishlistRouter = require('./Routes/wishlistRoute');
const addressRouter = require('./Routes/addressRoute');
const couponRouter = require('./Routes/couponRoute');
const cartRouter = require('./Routes/cartRoute');
const feesRouter = require('./Routes/feesRoute');
const orderRouter = require('./Routes/orderRoute');
const { webHooksAndCreateOnlineOrder } = require('./Controllers/orderController');
const cors = require('cors') 
const compression = require('compression') 
const rateLimit = require('express-rate-limit') 
const hpp = require('hpp') 
const mongoSanitize = require('express-mongo-sanitize') 
const xss = require('xss-clean'); 
const carouselRouter = require('./Routes/carouselRoute');
const emailRouter = require('./Routes/emailRoute');


// config.env
dotenv.config({path: "config.env"}); 
const port = process.env.PORT || 8000 

// DB Connection
DBConnection()

// express App
const app = express();


app.use(cors())
app.options('*', cors())


app.use(compression())

app.post('/webhook', express.raw({type: 'application/json'}), webHooksAndCreateOnlineOrder) 

// Middlewares
if (process.env.NODE_ENV === 'development'){
    app.use(morgan("dev")) 
    console.log('\x1b[35m%s\x1b[0m', `mode: ${process.env.NODE_ENV}`)
}

// security 1- request size limit
app.use(express.json({limit: "20kb"})) 
app.use(express.static(path.join(__dirname, 'uploads'))) 


// security 4- data sanitization

app.use(mongoSanitize()) 
app.use(xss()) 

// security 2- brute force
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 200,
    message: "too many requests please try again later"
})
app.use("/", limiter) 

// security 3- hpp (http parameter pollution)
// app.use(hpp({whitelist: ["price"]}))


// MOUNT Routes

app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/subcategories', subCategoryRouter)
app.use('/api/v1/brands', brandRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/loggeduser', loggedUserRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/wishlists', wishlistRouter)
app.use('/api/v1/address', addressRouter)
app.use('/api/v1/coupons', couponRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/fees', feesRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/carousel', carouselRouter)
app.use('/api/v1/email', emailRouter)

app.use("*", (req, res, next) => {
    next(new apiError(`there is no such route for ${req.originalUrl}`, 404))
})

app.use(errorStoreMiddleware)


const server = app.listen(port, () => {
    console.log('\x1b[35m%s\x1b[0m', `App Listening on port ${process.env.PORT}`)
})

process.on("unhandledRejection", (err) => {
    console.error('\x1b[41m%s\x1b[0m', `Unhandled Rejection Error --> ${err.name} : ${err.message}`)
    server.close(() => {
        console.error('\x1b[35m%s\x1b[0m', "Shutting down App ...")
        process.exit(1)
    })
})


