const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    _id: String,
    orderNumber: Number,
    responsiblePerson: String,
    healthCareDistrict: {
      type: String,
      enum: ['HYKS', 'KYS', 'OYS', 'TAYS', 'TYKS'],
    },
    vaccine: {
      type: String,
      enum: ['Antiqua', 'SolarBuddhica', 'Zerpfy'],
    },
    injections: Number,
    arrived: Date,
  },
  { _id: false }
)

orderSchema.virtual('used', {
  ref: 'Vaccination',
  localField: '_id',
  foreignField: 'sourceBottle',
  // justOne: true,
})

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Order', orderSchema)
