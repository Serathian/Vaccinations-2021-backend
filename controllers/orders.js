const ordersRouter = require('express').Router()

//Libraries
const lineReader = require('line-reader')
const path = require('path')

//Mongoose schema
const Order = require('../models/order')

ordersRouter.get('/', async (req, res) => {
  const orders = await Order.find({}).limit(0)
  res.json(orders)
})

//Populate endpoint !!!!Missing logic for avoiding duplicate data
ordersRouter.get('/populate/:brand', (req, res) => {
  //Getting the directory based on brand provided in the the API call
  const brand = req.params.brand
  const getDirectory = () => {
    switch (brand) {
      case 'Antiqua':
        return path.join(__dirname, '..', 'data', 'Antiqua.source')
      case 'Solar':
        return path.join(__dirname, '..', 'data', 'SolarBuddhica.source')
      case 'Zerpfy':
        return path.join(__dirname, '..', 'data', 'Zerpfy.source')
      default:
        return null
    }
  }

  //If brand matches we run the lineReader
  if (getDirectory() != null) {
    lineReader.eachLine(
      getDirectory(),
      async (line) => {
        //Parsing the string into a Object
        const lineObject = JSON.parse(line)

        const order = new Order({
          _id: lineObject['id'],
          orderNumber: lineObject['orderNumber'],
          responsiblePerson: lineObject['responsiblePerson'],
          healthCareDistrict: lineObject['healthCareDistrict'],
          vaccine: lineObject['vaccine'],
          injections: lineObject['injections'],
          arrived: lineObject['arrived'],
        })
        try {
          const savedOrder = await order.save()
          console.log(savedOrder._id)
        } catch (err) {
          console.log(err)
        }
      },
      (err) => {
        if (err) throw err
        console.log("I'm done!!")
        res.send(`Done! and populated --Orders-- --${brand}-- entries`)
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
