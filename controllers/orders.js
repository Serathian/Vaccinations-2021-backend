const ordersRouter = require('express').Router()
const { getDirectory, toOrder } = require('../utils/controller-helpers')

// Libraries
const lineReader = require('line-reader')

// Mongoose schema
const Order = require('../models/order')

ordersRouter.get('/', async (req, res) => {
  const orders = await Order.find({}).limit(0)
  res.json(orders)
})

// Populate endpoint !!!!Missing logic for avoiding duplicate data
ordersRouter.get('/populate/:brand', async (req, res) => {
  // Getting the directory based on brand provided in the the API call
  const brand = req.params.brand
  const directory = getDirectory(brand)

  let array = []
  // If brand matches we run the lineReader
  if (directory != null) {
    lineReader.eachLine(
      directory,
      (line) => {
        // Parsing the string into a Object
        const lineObject = JSON.parse(line)

        const order = toOrder(lineObject)

        array.push(order)
      },
      async (err) => {
        if (err) throw err
        console.log("I'm done!!")

        try {
          const savedOrders = await Order.insertMany(array)
          res.send(`Done! and send ${savedOrders.length}`)
        } catch (err) {
          console.log(err)
        }
      }
    )
  } else {
    res.send(`${brand} is not a valid brand`)
  }
})

//Test endpoint
ordersRouter.get('/test', (_req, res) => {
  res.send('Orders endpoint is running!')
})

module.exports = ordersRouter
