const express = require('express');
const ExpressError = require('../expressError')
const router = express.Router();
const db = require('../db');


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({ invoices : results.rows })
    } catch (e) {
        return next(e);
    }
})


router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT i.id, i.amt, i.paid, i.add_date, i.paid_date, 
        c.name, c.code, c.description 
        FROM invoices AS i
        INNER JOIN companies AS c ON (i.comp_code = c.code)  
        WHERE id = $1`, [id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id ${id}`, 404)
        }
        return res.send({ invoice : results.rows[0] })
    } catch (e) {
        return next(e)
    }
})


router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt]);
        return res.status(201).json({ invoice : results.rows[0] })
    } catch (e) {
        return next(e)
    }
})


router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt, paid } = req.body;
        let paidDate = null; 
        const invoiceExistsResult = await db.query(`SELECT paid FROM invoices WHERE id = $1`, [id]);
  
        if (invoiceExistsResult.rows.length === 0) {
            throw new ExpressError(`Invoice with id ${id} does not exist`, 404);
        }

        const currPaidDate = invoiceExistsResult.rows[0].paid_date;

        if (!currPaidDate && paid) {
          paidDate = new Date();
        } else if (!paid) {
          paidDate = null
        } else {
          paidDate = currPaidDate;
        }
    
        const result = await db.query(`UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paid, paidDate, id]);
  
        return res.json({ invoice : result.rows[0]});

    } catch (e) {
        return next(e)
    }
})


router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query('DELETE FROM invoices WHERE id = $1 RETURNING id', [id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice with id ${id} does not exist`, 404)
        }
        return res.send({ status: 'deleted' })
    } catch (e) {
        return next(e)
    }
})


module.exports = router;