const express = require('express');
const ExpressError = require('../expressError')
const router = express.Router();
const db = require('../db');



router.get('/', async (req, res, next) => {
    try {
        // const results = await db.query('SELECT i.code, i.field FROM industries AS i')

        const results = await db.query('SELECT c.code, c.field, i.company_code FROM industries_companies AS i INNER JOIN industries AS c ON (i.industry_code = c.code)')
        return res.json({ industries : results.rows })
    } catch (e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { code, field } = req.body;
        const results = await db.query('INSERT INTO industries (code, field) VALUES ($1, $2) RETURNING code, field', [code, field]);
        return res.status(201).json({ industry: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})


module.exports = router;