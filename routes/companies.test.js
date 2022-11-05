process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');


let testCompany;

beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('sdb', 'Bones, inc.', 'Scooby bone ideas') RETURNING code, name, description`);
    testCompany = result.rows[0]
})

afterEach(async () => {
  await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
  await db.end()
})

// Why doesn't this test work???
describe('GET /companies', () => {
    test('Get all companies', async () => {
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ companies: [testCompany] })
    })
})


describe('GET /companies/:code', () => {
    test('Gets a single company info', async () => {
        const res = await request(app).get(`/companies/${testCompany.code}`)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ company : testCompany })
    })
    test('Responds with 404 for invalid code', async () => {
        const res = await request(app).get(`/companies/0`)
        expect(res.statusCode).toBe(404);
    })
})


describe('POST /companies', () => {
    test('Add a new company', async () => {
        const res = await request(app).post('/companies').send({ name: 'Goldies Gowns', description: 'pretty dresses' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            company: { code: "goldies-gowns", name: 'Goldies Gowns', description: 'pretty dresses' }
        })
    })
})


describe('/PATCH /companies/:code', () => {
    test('Updating a company', async () => {
        const res = await request(app).patch(`/companies/${testCompany.code}`).send({ code: 'sbd', name: 'Bones, Inc.', description: 'a bone collection' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          company: { code: testCompany.code, name: 'Bones, Inc.', description: 'a bone collection' }
        })
    })
})


describe('DELETE /companies/:code', () => {
    test('Deletes company', async () => {
        const res = await request(app).delete(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'deleted'})
    })
})

