process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');


let testInvoice;

beforeEach(async () => {
    // const res = await db.query(`INSERT INTO companies (code, name, description) VALUES ('sdb', 'Bones, inc.', 'Scooby bone ideas') RETURNING code, name, description`);
    const result = await db.query(`INSERT INTO invoices (id, comp_code, amt, paid, add_date) VALUES (1, 'sdb', 350, true, CURRENT_DATE) RETURNING id, comp_code, amt, paid, add_date`);
    testInvoice = result.rows[0]
})

afterEach(async () => {
    await db.query(`DELETE FROM invoices`)
    // await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
  await db.end()
})

// describe('GET /companies', () => {
//     test('Get all companies', async () => {
//         const res = await request(app).get('/companies');
//         expect(res.statusCode).toBe(200)
//         expect(res.body).toEqual({ companies: [testCompany] })
//     })
// })


// describe('GET /invoices/:id', () => {
//     test('Gets a single invoice info', async () => {
//         const res = await request(app).get(`/invoices/${testInvoice.id}`)
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({ invoice : testInvoice })
//     })
// })


