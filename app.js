//Local modules
const config = require('./utils/config')
const logger = require('./utils/logger')

//Non-native modules
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

//Router imports
const vaccinationsRouter = require('./controllers/vaccinations')
const ordersRouter = require('./controllers/orders')
const dataRouter = require('./controllers/data')

//APP INITIALIZATION
const app = express()
//Mongoose connecting
logger.info('Connecting to: ', config.MONGODB_URI)
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => logger.info('connecting to mongoDB'))
  .catch((error) =>
    logger.error('Error connecting to MongoDB: ', error.message)
  )

//Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('common'))
app.use(express.static('build'))

//Router initialization
app.use('/api/data', dataRouter)
app.use('/api/vaccinations', vaccinationsRouter)
app.use('/api/orders', ordersRouter)

module.exports = app
