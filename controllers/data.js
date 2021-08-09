const dataRouter = require('express').Router()
const _ = require('lodash')

const Order = require('../models/order')
const Vaccination = require('../models/vaccination')

dataRouter.get('/:date', async (req, res) => {
  const [date, time] = req.params.date.split('T')
  const [year, month, day] = date.split('-')
  const nextDay = +day + 1

  const dateStart = new Date(`${year}-${month}-${day}`)
  const dateEnd = new Date(`${year}-${month}-${nextDay.toString()}`)

  //todo: start testing.

  //!! am i going to use this?
  //   const vaccineResult = await Vaccination.find({
  //     vaccinationDate: { $lte: date },
  //   })

  const orderResult = await Order.find({ arrived: { $lte: dateEnd } }).populate(
    {
      path: 'used',
      match: { vaccinationDate: { $lte: date } },
    }
  )

  const groupedOrders = _.groupBy(orderResult, 'vaccine')
  const antiqua = groupedOrders.Antiqua ? groupedOrders.Antiqua.length : 0
  const solarBuddhica = groupedOrders.SolarBuddhica
    ? groupedOrders.SolarBuddhica.length
    : 0
  const zerpfy = groupedOrders.Zerpfy ? groupedOrders.Zerpfy.length : 0
  const vaccinationsOrdered = {
    Antiqua: antiqua,
    SolarBuddhica: solarBuddhica,
    Zerpfy: zerpfy,
  }

  const ordersMade = orderResult.length
  const ordersArrivingToday = orderResult.filter((obj) => {
    return obj.arrived >= dateStart && obj.arrived <= dateEnd
  }).length
  const usedVaccines = _.sumBy(orderResult, 'used.length')

  //bottles expire after 30 days
  const getDifferenceInDays = (date1, date2) => {
    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    )
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    )

    const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const expiringNow = 30
  const expiringToday = orderResult.filter((obj) => {
    const diff = getDifferenceInDays(obj.arrived, dateEnd)
    return diff === expiringNow
  })
  const bottlesExpiringToday = _.sumBy(expiringToday, 'injections')

  const expiringSoon = 20
  //Getting an array
  const expiringIn10Days = orderResult.filter((obj) => {
    const diff = getDifferenceInDays(obj.arrived, dateEnd)
    return diff >= 20 && diff <= 30
  })

  const bottlesExpiringWithin10Days = _.sumBy(expiringIn10Days, 'injections')

  const response = {
    vaccinationsOrdered,
    ordersMade,
    usedVaccines,
    ordersArrivingToday,
    bottlesExpiringToday,
    bottlesExpiringWithin10Days,
  }

  res.json(response)
})

module.exports = dataRouter
