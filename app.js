const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const schedulesRouter = require('./controllers/schedule-endpoints')
require('express-async-errors')

console.log('connecting to MongoDB...')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connection established successfully!')
  })
  .catch((error) => {
    logger.error(`error connecting to MongoDB: ${error}`)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/schedules', schedulesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app