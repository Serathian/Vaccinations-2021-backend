const mongoose = require('mongoose')

const dbHandler = require('./db-handler')

const supertest = require('supertest')
const app = require('../app')

const vaccinationsRouter = require('../controllers/vaccinations')
const ordersRouter = require('../controllers/orders')
const dataRouter = require('../controllers/data')

const api = supertest(app)

app.use('/api/data', dataRouter)
app.use('/api/vaccinations', vaccinationsRouter)
app.use('/api/orders', ordersRouter)

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await dbHandler.connect()

  // await api.get('/api/vaccinations/populate')
  // await api.get('/api/orders/populate/Zerpfy')
  // await api.get('/api/orders/populate/Solar')
  // await api.get('/api/orders/populate/Antiqua')
})

/**
 * Clear all test data after every test.
 */
// afterEach(async () => await dbHandler.clearDatabase())

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase())

describe('database populates', () => {
  test('with vaccinations', async () => {
    const response = await api.get('/api/vaccinations/populate/')

    expect(response.text).toEqual('Done! and send 7000')
  })
  test('with Zerpfy orders', async () => {
    const response = await api.get('/api/orders/populate/Zerpfy')

    expect(response.text).toEqual('Done! and sent 1663')
  })
  test('with Solar orders', async () => {
    const response = await api.get('/api/orders/populate/Solar')

    expect(response.text).toEqual('Done! and sent 1676')
  })
  test('with Antiqua orders', async () => {
    const response = await api.get('/api/orders/populate/Antiqua')

    expect(response.text).toEqual('Done! and sent 1661')
  })
  test('all data is present, orders: 5000 vaccinations: 7000', async () => {
    const date = new Date()
    const response = await api.get(`/api/data/${date.toISOString()}`)

    expect(response.body.ordersMade).toBe(5000)
    expect(response.body.usedVaccines).toBe(7000)
  })
})
describe('When get request is made', () => {
  test('date is returned as json', async () => {
    const date = new Date()
    await api
      .get(`/api/data/${date.toISOString()}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test(`no orders are returned if date doesn't exist (Date 1970)`, async () => {
    const date = new Date(0)
    const response = await api.get(`/api/data/${date.toISOString()}`)

    expect(response.body.ordersMade).toBe(0)
    expect(response.body.usedVaccines).toBe(0)
  })

  test(`error if endpoint doesn't exist`, async () => {
    await api.get(`/api/data/`).expect(404)
  })

  test(`"2021-03-20" arrived 61 orders`, async () => {
    const date = new Date('2021-03-20')
    const response = await api.get(`/api/data/${date.toISOString()}`)

    expect(response.body.ordersArrivingToday).toBe(61)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
