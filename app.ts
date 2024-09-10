import config from "./utils/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
// require('express-async-errors')
const app = express()

// ROUTER REFERENCE
import usersRouter from "./routes/user.routes"
import loginRouter from "./routes/login.route"
import productRouter from "./routes/product.routes"
import orderRouter from "./routes/order.route"
import reviewRouter from "./routes/review.route"

import User from "./models/user.model";
import Order from "./models/order.model";
import Review from "./models/review.model";
import Product from "./models/product.model";

// const middleware = require('./utils/middleware')
import logger from "./utils/logger"
import middleware from "./utils/middleware"
mongoose.set('strictQuery', false)

// logger.info('connecting to', config.MONGODB_URI)


mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
// app.use(middleware.requestLogger)

async function resetAllData() {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    logger.info('All data has been reset.');
  } catch (error: any) {
    logger.error('Error resetting data:', error.message);
  }
}

resetAllData();

// ROUTER
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/reviews', reviewRouter)

// app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
