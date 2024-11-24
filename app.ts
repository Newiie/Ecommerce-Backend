import config from "./utils/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import middleware from "./utils/middleware"
import cookieParser from "cookie-parser"

require('express-async-errors')
const app = express()

// ROUTER REFERENCE
import usersRouter from "./routes/user.routes"
import authRouter from "./routes/auth.route"
import productRouter from "./routes/product.routes"
import orderRouter from "./routes/order.route"
import reviewRouter from "./routes/review.route"
import paypalRouter from "./routes/paypal.route"

import logger from "./utils/logger"

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

// MIDDLEWARES
const allowedOrigins = [config.FRONTEND_URL, 'http://localhost:3000', 'https://supreme-team-demo.netlify.app'];

app.use(cookieParser());

app.use(cors({}))



app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// middleware.resetAllData()

// ROUTER
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/paypal', paypalRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
