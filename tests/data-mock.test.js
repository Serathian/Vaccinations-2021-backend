const mongoose = require('mongoose')

const dbHandler = require('./db-handler')

const vaccinationsRouter = require('./controllers/vaccinations')
const ordersRouter = require('./controllers/orders')
const dataRouter = require('./controllers/data')

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect())

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase())

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase())
