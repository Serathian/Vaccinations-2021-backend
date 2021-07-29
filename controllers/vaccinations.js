const vaccinationsRouter = require('express').Router()
const lineReader = require('line-reader')
const path = require('path')
const mongoose = require('mongoose')

const Vaccination = require('../models/vaccination')

//`${__dirname}/data/vaccinations.source`
const directory = path.join(__dirname, '..', 'data', 'vaccinations.source')

vaccinationsRouter.get('/', async (req, res) => {
  const vaccinations = await Vaccination.find({}).populate('sourceBottle', {
    healthCareDistrict: 1,
    arrived: 1,
  })
  res.json(vaccinations)
})

//Populate endpoint, !!!missing logic for avoiding duplicate data
vaccinationsRouter.get('/populate', (req, res) => {
  lineReader.eachLine(
    directory,
    async (line) => {
      const lineObject = JSON.parse(line)

      const vaccination = new Vaccination({
        _id: lineObject['vaccination-id'],
        sourceBottle: lineObject['sourceBottle'],
        gender: lineObject['gender'],
        vaccinationDate: lineObject['vaccinationDate'],
      })
      try {
        const savedVaccination = await vaccination.save()
        console.log('Success!', savedVaccination)
      } catch (err) {
        console.log(err)
      }
    },
    (err) => {
      if (err) throw err
      console.log("I'm done!!")
      res.send(`Done! and populated --Vaccination-- entries`)
    }
  )
})

module.exports = vaccinationsRouter