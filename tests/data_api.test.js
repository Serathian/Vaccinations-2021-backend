const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  const date = new Date()
  await api
    .get(`/api/data/${date.toISOString()}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all orders are returned, orders: 5000 vaccinations: 7000', async () => {
  const date = new Date()
  const response = await api.get(`/api/data/${date.toISOString()}`)

  expect(response.body.ordersMade).toBe(5000)
  expect(response.body.usedVaccines).toBe(7000)
})

test('no orders are returned (Date 1970)', async () => {
  const date = new Date(0)
  const response = await api.get(`/api/data/${date.toISOString()}`)

  expect(response.body.ordersMade).toBe(0)
  expect(response.body.usedVaccines).toBe(0)
})

test(`endpoint doesn't exist`, async () => {
  await api.get(`/api/data/`).expect(404)
})

test(`"2021-03-20" arrived 61 orders`, async () => {
  const date = new Date('2021-03-20')
  const response = await api.get(`/api/data/${date.toISOString()}`)

  expect(response.body.ordersArrivingToday).toBe(61)
})

afterAll(() => {
  mongoose.connection.close()
})
