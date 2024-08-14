const express = require("express");
const router = express.Router();
const cors = require("cors");
const pool = require("../db")

router.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    allowedHeaders: 'Origin, Content-Type, Accept', // Corrected to 'Content-Type'
    methods: ['GET', 'PUT']
}));


router.get('/sales', async (req, res) => {
    try {
        const scard = await pool.query("select month, ROUND(sum(o_amt)) as order, ROUND(sum(rt_amt)) as return, ROUND(sum(sl_amt)) as sale, count(DISTINCT shop_name) from sales_details where month = to_char(current_date - INTERVAL '1 MONTH', 'Mon-yy') group by month order by to_date(month, 'Mon-YY')")
        const schart = await pool.query("select month, ROUND(sum(o_amt)) as order, ROUND(sum(rt_amt)) as return, ROUND(sum(sl_amt)) as sale from sales_details group by month order by to_date(month, 'Mon-YY')")
        const pchart = await pool.query("select bcategory, ROUND(sum(sl_amt)) as sale from sales_details where month = 'Mar-24' and bcategory != 'OTHER' group by bcategory")
        const hchart = await pool.query("select category_group as cat, ROUND(sum(sl_amt)) as sale, ROUND(sum(rt_amt)) as return from sales_details where month = 'Mar-24' group by category_group order by sale desc")
        res.send([{"scard" : scard.rows, "schart" : schart.rows, "pchart" : pchart.rows, "hchart" : hchart.rows}])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/shop', async (req, res) => {
    try {
        const clist = await pool.query("select distinct shop_name as shop from sales_details order by shop_name")
        res.send(clist.rows)
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/subcats', async (req, res) => {
    try {
        const subcat = await pool.query("select distinct(subcategory) from m_view_monthly order by subcategory asc")
        res.send(subcat.rows)
    } catch (error) {
    console.log(error.message)
    }
})

router.get('/shops/:id', async (req, res) => {
    id = req.params.id;
    try {
        const shopytd = await pool.query("SELECT MONTH, ROUND(sum(o_amt)) as order, ROUND(sum(rt_amt)) as return, (sum(rt_amt)/sum(o_amt))*100 as rt, ROUND(SUM(sl_amt)) as sale from sales_details where shop_name = $1 group by month order by to_date(month, 'Mon-yy') DESC limit 13", [id])
        const shopcat = await pool.query("SELECT MONTH, category_group, ROUND(SUM(sl_amt)) as sale, ROUND(sum(rt_amt)) as return from sales_details where shop_name = $1 group by month, category_group ", [id])
        res.send([{"shopytd" : shopytd.rows, "shopcat" : shopcat.rows}])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/incentive', async (req, res) => {
    try {
    const mon = await pool.query("SELECT to_char(month, 'Mon-YY') AS mon FROM (SELECT DISTINCT to_date(month, 'Mon-yy') AS month FROM sales_details) AS converted_months ORDER BY month DESC;");
    const insdata = await pool.query("SELECT month, shopname, SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) AS ord_amt, SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END) AS rt_amt, CASE WHEN SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) = 0 THEN NULL ELSE ROUND(SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END)::numeric / SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END::numeric) * 100::numeric, 2)::numeric END AS ord_rt_ratio FROM public.incentive GROUP BY month, shopname")
    res.send([{"month" : mon.rows, "indata" : insdata.rows}]);
    res.send(mon);
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/performance', async (req, res) => {
        let start = req.body.start;
        let end = req.body.end;
    try {
        const highReturn = await pool.query("SELECT shopname, SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) AS total_order, SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END) AS total_return, CASE WHEN SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) = 0 THEN 0 ELSE (SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END) / SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END)) * 100 END AS diff FROM daywise WHERE date >= $1 AND date <= $2 GROUP BY shopname ORDER BY diff DESC LIMIT 10", [start, end])
        const lowReturn = await pool.query("SELECT shopname, SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) AS total_order, SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END) AS total_return, CASE WHEN SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) = 0 THEN 0 ELSE (SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END) / SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END)) * 100 END AS diff FROM daywise WHERE date >= $1 AND date <= $2 GROUP BY shopname ORDER BY diff asc LIMIT 10", [start, end])
        const chartReturn = await pool.query("SELECT subcategory, sum(amt) FROM daywise WHERE date >= $1 AND date <= $2 and type = 'return' group by subcategory", [start, end])
        const proHighret = await pool.query("SELECT productname, sum(qty) as qty, sum(amt) as amt FROM daywise WHERE date >= $1 AND date <= $2 and type = 'return' group by productname order by amt desc limit 10", [start, end])
        const proLowret = await pool.query("SELECT productname, sum(qty) as qty, sum(amt) as amt FROM daywise WHERE date >= $1 AND date <= $2 and type = 'return' group by productname order by amt asc limit 10", [start, end])
        res.send({"highret" : highReturn.rows, "lowret" : lowReturn.rows, "chartret" : chartReturn.rows, "prohigh" : proHighret.rows, "prolow" : proLowret.rows})
    } catch (error) {
        res.send(error.message)
    }
})

router.post('/comp1', async (req, res) => {
    let one = req.body.selectedFirst.value;
    const firstcust = await pool.query("SELECT mon, SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) AS total_order, SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END) AS total_return FROM m_view_monthly WHERE shopname = $1 GROUP BY mon ORDER BY to_date(mon, 'Mon-yy') DESC LIMIT 13", [one]);
    const cat = await pool.query("SELECT mon, subcategory, SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) AS total_order, SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END) AS total_return FROM m_view_monthly WHERE shopname = $1 GROUP BY mon, subcategory ORDER BY to_date(mon, 'Mon-yy') DESC LIMIT 13", [one])
    res.send({"firstcust" : firstcust.rows, "fcat" : cat.rows})
})

router.post('/comp2', async (req, res) => {
    let two = req.body.selectedSecond.value;
    const secondcust = await pool.query("SELECT mon, SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) AS total_order, SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END) AS total_return FROM m_view_monthly WHERE shopname = $1 GROUP BY mon ORDER BY to_date(mon, 'Mon-yy') DESC LIMIT 13", [two]);
    const scat = await pool.query("SELECT mon, subcategory, SUM(CASE WHEN type = 'order' THEN amt ELSE 0 END) AS total_order, SUM(CASE WHEN type = 'return' THEN amt ELSE 0 END) AS total_return FROM m_view_monthly WHERE shopname = $1 GROUP BY mon, subcategory ORDER BY to_date(mon, 'Mon-yy') DESC LIMIT 13", [two])
    res.send({"secondcust" : secondcust.rows, "scat" : scat.rows})
})



module.exports = router;