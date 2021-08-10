const vaccinationsRouter = require('express').Router()
const lineReader = require('line-reader')
const path = require('path')
const Vaccination = require('../models/vaccination')
const { toVaccination } = require('../utils/controller-helpers')

vaccinationsRouter.get('/', async (req, res) => {
  const vaccinations = await Vaccination.find({})
    .limit(0)
    .populate('sourceBottle', {
      healthCareDistrict: 1,
      arrived: 1,
      injections: 1,
    })
  res.json(vaccinations)
})

// Populate endpoint, !!!missing logic for avoiding duplicate data
const directory = path.join(__dirname, '..', 'data', 'vaccinations.source')
vaccinationsRouter.get('/populate', async (req, res) => {
  let array = []

  lineReader.eachLine(
    directory,
    (line) => {
      const lineObject = JSON.parse(line)

      const vaccination = toVaccination(lineObject)

      array.push(vaccination)
    },
    async (err) => {
      console.log(err)
      console.log("I'm done!!")

      try {
        const savedVaccinations = await Vaccination.insertMany(array)
        res.send(`Done! and send ${savedVaccinations.length}`)
      } catch (err) {
        console.log(err)
      }
    }
  )
})

module.exports = vaccinationsRouter
