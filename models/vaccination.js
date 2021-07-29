const mongoose = require('mongoose')

const vaccinationSchema = new mongoose.Schema(
  {
    _id: String,
    sourceBottle: {
      type: String,
      ref: 'Order',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'nonbinary'],
    },
    vaccinationDate: Date,
  },
  { _id: false }
)

vaccinationSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Vaccination', vaccinationSchema)
