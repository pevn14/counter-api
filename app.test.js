const app = require('./server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

// 1ere serie de test: test minimal d'acces
describe('test minimal api acces without data', () =>{
  // test du retour 404
  it('gets the 404 endpoint', async done => {
    const response = await request.get('/')
    expect(response.status).toBe(404)
    done()
  })
  // test du get /
  it('gets the get / endpoint', async done => {
    const response = await request.get('/api/v1/counters')
    expect(response.status).toBe(200)
    expect(response.body.result.size).toBeGreaterThanOrEqual(0)
    done()
  })

  it('gets the get /id endpoint with bad id', async done => {
    const response = await request.get('/api/v1/counters/notKeyCcounter')
    expect(response.status).toBe(500)
    expect(response.body.status).toStrictEqual(`error`)
    expect(response.body.message).toStrictEqual(`notKeyCcounter is not a key`)
    done()
  })
})

// 2 eme serie de test: creation de compteur, inc/dec relecture et destruction
describe('test api with all verbs', () =>{
    let testCounters = [['testCounter1',10],['testCounter2',-10],['testCounter3',0]]
    let testIncrement = 1
    let testDecrement = 5
    let initialSize
    // get de tous les compteurs ; memo de la size
    it('gets the get / endpoint', async done => {
        const response = await request.get('/api/v1/counters')
        expect(response.status).toBe(200)
        expect(response.body.status).toStrictEqual(`success`)
        initialSize = response.body.result.size
        done()
    })
    // put: creation de nouveaux compteurs + inc, dec
    // get: relecture de chaque compteur
    testCounters.forEach(([counter,value]) => {
        //put: creation
        it('create a new counter', async done => {
            const response = await request.put('/api/v1/counters/'+counter+'?val='+value)
            expect(response.status).toBe(201)
            done()
        })
        //put: increment
        it('increment the counter', async done => {
            const response = await request.patch('/api/v1/counters/'+counter+'?val='+testIncrement)
            expect(response.status).toBe(201)
            done()
        })
        //put: decrement
        it('decrement the counter', async done => {
            const response = await request.patch('/api/v1/counters/'+counter+'?val='+testDecrement+'&dec=on')
            expect(response.status).toBe(201)
            done()
        })
        //get: relecture et verif des valeurs
        it('get and check the counter', async done => {
            const response = await request.get('/api/v1/counters/'+counter)
            expect(response.status).toBe(200)
            expect(Object.values(response.body.result)[0]).toBe(value+testIncrement-testDecrement)
            expect(Object.keys(response.body.result)[0]).toBe(counter)
            done()
        })

     });
    // relecture de tous les compteurs et verif de la size
    it('gets the get / endpoint', async done => {
        const response = await request.get('/api/v1/counters')
        expect(response.status).toBe(200)
        expect(response.body.status).toStrictEqual(`success`)
        expect(response.body.result.size).toBe(initialSize + testCounters.length)
        done()
    })
    // delete: de chaque compteur
    testCounters.forEach(([counter,value]) => {
        it('delete a counter', async done => {
            const response = await request.delete('/api/v1/counters/'+counter)
            expect(response.status).toBe(200)
            done()
        })
    })
    // test du retour a la situation initiale
    it('gets the get / endpoint', async done => {
        const response = await request.get('/api/v1/counters')
        expect(response.status).toBe(200)
        console.log(`Size 3:${response.body.result.size}`)
        expect(response.body.status).toStrictEqual(`success`)
        expect(response.body.result.size).toBe(initialSize)
        done()
    })
})

// reste a faire:
// test des codes retours erreur
// test de l'idempot du put
// test du checks des params + vals par def

  
    