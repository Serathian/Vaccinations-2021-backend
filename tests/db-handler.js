// tests/db-handler.js

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  await mongoose.disconnect()

  mongoServer = await MongoMemoryServer.create()
  const mongoUri = await mongoServer.getUri()

  const opts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  }
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) {
      console.error(err)
    }
  })

  console.log('Mongo-Memory CONNECTED!')
}

/**
 * Drop database, close the connection and stop mongodb.
 */
module.exports.closeDatabase = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
  console.log('Mongo-Memory connect CLOSED!')
}

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    await collections[key].deleteMany()
  }

  console.log('Mongo-Memory CLEARED!')
}
