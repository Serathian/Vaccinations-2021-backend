const path = require('path')
const Order = require('../models/order')
const Vaccination = require('../models/vaccination')

const getDirectory = (brand) => {
  switch (brand) {
    case 'Antiqua':
      return path.join(__dirname, '..', 'data', 'Antiqua.source')
    case 'Solar':
      return path.join(__dirname, '..', 'data', 'SolarBuddhica.source')
    case 'Zerpfy':
      return path.join(__dirname, '..', 'data', 'Zerpfy.source')
    default:
      return path
  }
}

const toOrder = (lineObject) => {
  const order = new Order({
    _id: lineObject['id'],
    orderNumber: lineObject['orderNumber'],
    responsiblePerson: lineObject['responsiblePerson'],
    healthCareDistrict: lineObject['healthCareDistrict'],
    vaccine: lineObject['vaccine'],
    injections: lineObject['injections'],
    arrived: lineObject['arrived'],
  })
  return order
}

const toVaccination = (lineObject) => {
  const vaccination = new Vaccination({
    _id: lineObject['vaccination-id'],
    sourceBottle: lineObject['sourceBottle'],
    gender: lineObject['gender'],
    vaccinationDate: lineObject['vaccinationDate'],
  })

  return vaccination
}

module.exports = {
  getDirectory,
  toOrder,
  toVaccination,
}
