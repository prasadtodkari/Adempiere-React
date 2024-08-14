const express = require("express");
const router = express.Router();
const cors = require("cors");
const pool = require("../db")

// List of allowed origins
const allowedOrigins = [
    'http://mis.ribboonsandballoons.com:3000',
    'http://192.168.1.3:3000',
    'http://mis.ribbonsandballoons.com/'
  ];
  
  const corsOptions = {
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: 'GET,POST',
    optionsSuccessStatus: 200,
    allowedHeaders: 'Origin, Content-Type, Accept, Authorization'
  };
  
  router.use(cors(corsOptions));

router.get('/prodlist', async(req, res) => {
    try {
    const list = await pool.query("select material_id as value, material_name as label from product_master")
    res.send([{"list" : list.rows}])   
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/prod/:id', async(req, res) => {
    let id = req.params.id;
    try {
    const grn = await pool.query("select supplier, delivery_date, qty, ROUND(rate::NUMERIC,2) as rate, ROUND(total_amt) as total_amt from grn_details where materialid = $1 order by delivery_date desc limit 13", [id])
    const ytd = await pool.query("select month, sum(qty) as qty, ROUND(avg(rate)::NUMERIC,2) as rate, ROUND(sum(total_amt)) as amt from grn_details where materialid = $1 group by month order by TO_DATE(SUBSTRING(month, 1, 3) || '-' || SUBSTRING(month, 5, 2), 'Mon-YY') DESC limit 13", [id])
    const stock = await pool.query("select qty, uom from stock_inhand where material_id = $1", [id])
    const ytChart = await pool.query("SELECT to_char(dates.month, 'Mon-yy') AS month, COALESCE(SUM(purchase_qty), 0) AS Purchase, COALESCE(SUM(consumption_qty), 0) AS Consumption FROM generate_series((SELECT MIN(to_date(month, 'Mon-yy')) FROM (SELECT month FROM grn_details UNION SELECT month FROM consumption) AS months), (SELECT MAX(to_date(month, 'Mon-yy')) FROM (SELECT month FROM grn_details UNION SELECT month FROM consumption) AS months), INTERVAL '1 month') AS dates(month) LEFT JOIN (SELECT to_date(month, 'Mon-yy') AS month, SUM(qty) AS purchase_qty FROM grn_details WHERE materialid = $1 GROUP BY month) AS p ON dates.month = p.month LEFT JOIN (SELECT to_date(month, 'Mon-yy') AS month, SUM(cons_qty) AS consumption_qty FROM consumption WHERE material_id = $1 GROUP BY month) AS c ON dates.month = c.month GROUP BY dates.month ORDER BY dates.month desc limit 13", [id])
    res.send([{"grn" : grn.rows, "ytd" : ytd.rows, "stock" : stock.rows, "yt" : ytChart.rows}])   
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/prodsearch', async (req, res) => {
    let start = req.body.start;
    let end = req.body.end;
    let product = req.body.selected;
    try {
        const prods = await pool.query("select supplier, grn_no, delivery_date, sum(qty) as qty, avg(rate) as rate, sum(amount) as amt FROM grn_details WHERE materialid = $1 AND receiving_date >= $2 AND receiving_date <= $3 GROUP BY supplier, grn_no, delivery_date ORDER BY delivery_date", [product, start, end])
        res.send(prods.rows)
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/category', async(req, res) => {
    try {
        const catData = await pool.query("SELECT subcategory, ROUND(SUM(CASE WHEN to_char(current_date - interval '12 month', 'Mon-YY' ) = month THEN amount ELSE 0 END)) AS a, ROUND(SUM(CASE WHEN to_char(current_date - interval '11 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS b, ROUND(SUM(CASE WHEN to_char(current_date - interval '10 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS c, ROUND(SUM(CASE WHEN to_char(current_date - interval '9 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS d, ROUND(SUM(CASE WHEN to_char(current_date - interval '8 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS e, ROUND(SUM(CASE WHEN to_char(current_date - interval '7 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS f, ROUND(SUM(CASE WHEN to_char(current_date - interval '6 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS g, ROUND(SUM(CASE WHEN to_char(current_date - interval '5 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS h, ROUNd(SUM(CASE WHEN to_char(current_date - interval '4 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS i, ROUND(SUM(CASE WHEN to_char(current_date - interval '3 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS j, ROUND(SUM(CASE WHEN to_char(current_date - interval '2 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS k, ROUND(SUM(CASE WHEN to_char(current_date - interval '1 month', 'Mon-YY' ) = month then amount ELSE 0 END)) AS l, ROUND(SUM(CASE WHEN to_char(current_date, 'Mon-YY') = month then amount ELSE 0 END)) AS M,	ROUND(SUM(amount)) as Total FROM grn_details WHERE receiving_date >= current_date - interval '12 month' GROUP BY subcategory ORDER BY total desc");
        res.send(catData.rows);
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = router;