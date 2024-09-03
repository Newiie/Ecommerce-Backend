import config from "./utils/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
// require('express-async-errors')
const app = express()

// ROUTER REFERENCE
import usersRouter from "./controllers/users"
import loginRouter from "./controllers/login"
// const treeRouter = require('./controllers/tree')

// const middleware = require('./utils/middleware')
import logger from "./utils/logger"
// const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)


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

// ROUTER
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
// app.use('/api/trees', treeRouter)

// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)

export default app
