const app = require('./server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('gets the 404 endpoint', async done => {
  const response = await request.get('/')
  expect(response.status).toBe(404)
  done()
})

it('gets the get / endpoint', async done => {
  const response = await request.get('/api/v1/counters')
  expect(response.status).toBe(200)
  expect(response.body.result.size).toBeGreaterThanOrEqual(0)
  // works only if counters is empty
  //expect(response.body.status).toStrictEqual(`success`)
  //expect(response.body.result.counters).toStrictEqual([])
  done()
})

it('gets the get /id endpoint with bad id', async done => {
  const response = await request.get('/api/v1/counters/notKeyCcounter')
  expect(response.status).toBe(500)
  expect(response.body.status).toStrictEqual(`error`)
  expect(response.body.message).toStrictEqual(`notKeyCcounter is not a key`)
  done()
})