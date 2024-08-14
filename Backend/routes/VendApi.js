const express = require("express");
const router = express.Router();
const cors = require("cors");
const pool = require("../db")

router.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    allowedHeaders: 'Origin, Content-Type, Accept', // Corrected to 'Content-Type'
    methods: ['GET', 'PUT'],
    credentials: true
}));

//Venodr API

router.get('/vend', async (rec, res) => {
    try {
        const clist = await pool.query("select distinct suppliercode as value, supplier as label from grn_details order by supplier")
        res.send([{"clist" : clist.rows}])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/vendr/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const grnd = await pool.query("SELECT grn_no, receiving_date, ROUND(SUM(total_amt)) FROM grn_details WHERE suppliercode = $1 GROUP BY grn_no, receiving_date ORDER BY receiving_date desc limit 13", [id])
        const vendytd = await pool.query("SELECT month, ROUND(sum(total_amt)) AS amt FROM grn_details WHERE suppliercode = $1 group by month ORDER BY TO_DATE(SUBSTRING(month, 1, 3) || '-' || SUBSTRING(month, 5, 2), 'Mon-YY') DESC limit 13", [id])
        const material = await pool.query("SELECT material, ROUND(AVG(qty)::NUMERIC,2) AS avg, ROUND(AVG(rate)::NUMERIC,2), ROUND(avg(total_amt)) AS amt FROM grn_details WHERE suppliercode = $1 group by material ORDER BY amt DESC", [id])
        res.send([{"grnd" : grnd.rows, "vytd" : vendytd.rows, "material" : material.rows}])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/vendor/:id', async (req, res) => {
    let grn = req.params.id;
    console.log(grn)
    try {
        const grndata = await pool.query("SELECT material, qty, rate, taxamount, total_amt from grn_details where grn_no = $1", [grn])
        res.send(grndata.rows)
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router;