const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')

//non-native imports
const lineReader = require('line-reader')
const morgan = require('morgan')
const cors = require('cors')

//Router imports
const casesRouter = require('./controllers/cases')
const vaccinationsRouter = require('./controllers/vaccinations')
const ordersRouter = require('./controllers/orders')

//APP INITIALIZATION
const app = express()

//Mongoose connecting
console.log('Connecting to: ', config.MONGODB_URI)
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('connecting to mongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB: ', error.message))

app.use(cors())
app.use(express.json())
app.use(morgan('common'))

//Router initialization

app.use('/api/cases', casesRouter)
app.use('/api/vaccinations', vaccinationsRouter)
app.use('/api/orders', ordersRouter)

module.exports = app
