const express = require("express");
const router = express.Router();
const cors = require("cors");
const pool = require("../db")
const jwt = require('jsonwebtoken');
const secKey = 'adfmkml,mda#4#4q3p4aeadfmk';

router.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    allowedHeaders: 'Origin, Content-Type, Accept', // Corrected to 'Content-Type'
    methods: ['GET', 'PUT']
}));

//login API

router.post('/login', async (rec, res) => {
    let uname = rec.body.username;
    let pass = rec.body.password;
    
     const login = await pool.query("select name, isactive from adempiere.ad_user where name = $1 and password = $2", [uname, pass]);
     if(login.rows.length > 0){ 
        let data = login.rows;
        jwt.sign({ data }, secKey, { expiresIn: "7d" }, (err, token) => {
            if(err){
                res.send({ message: "something went Wrong"})
            }
            res.send({ user: data, auth: token })
        });
    }else{
        res.status(401).json({message: 'Invalid User'});
        console.log('no user')
    }
})

//Home API

router.get('/home', async(req, res) => {
    try {
        const card = await pool.query("select projectiontype, sum(amount) from adempiere.af_daily_projection where month = to_char(current_date - interval '1 month', 'YYYY-mm') group by projectiontype")
        const proj = await pool.query("select projectiontype, sum(amount) from adempiere.projection where month = to_char(current_date - interval '1 month', 'YYYY-mm') group by projectiontype")
        const chartdata = await pool.query("SELECT to_char(to_date(month, 'YYYY-MM'), 'MON-YY') AS month, projectiontype, SUM(CASE WHEN amount < 0 THEN ROUND(-amount) ELSE ROUND(amount) END) AS sum_amount FROM adempiere.af_daily_projection GROUP BY to_char(to_date(month, 'YYYY-MM'), 'MON-YY'), to_date(month, 'yyyy-mm'), projectiontype ORDER BY to_date(month, 'yyyy-mm') DESC, projectiontype LIMIT 28;")
        const client = await pool.query("select c.name, round(sum(case when (projectiontype='Revenue') then a.amount else null end),0)*-1 as rev, round(sum(case when (projectiontype='COGS') then a.amount else null end),0)as COGS, round(sum(case when (projectiontype='Labour') then a.amount else null end),0)as Labour, round(sum(case when (projectiontype='OH') then a.amount else null end),0)as OH from adempiere.af_daily_projection a left join adempiere.ad_org b on a.ad_org_id = b.ad_org_id left join adempiere.af_client_group c on b.af_client_group_id=c.af_client_group_id where month = to_char(current_date - interval '1 month', 'YYYY-mm') group by c.name")
        const site = await pool.query("select c.name as group, b.name as site, round(sum(case when (projectiontype='Revenue') then a.amount else 0 end),0)*-1 as rev, round(sum(case when (projectiontype='COGS') then a.amount else 0 end),0)as COGS, round(sum(case when (projectiontype='Labour') then a.amount else 0 end),0)as Labour, round(sum(case when (projectiontype='OH') then a.amount else 0 end),0)as OH from adempiere.af_daily_projection a left join adempiere.ad_org b on a.ad_org_id = b.ad_org_id left join adempiere.af_client_group c on b.af_client_group_id=c.af_client_group_id where month = to_char(current_date - interval '1 month', 'YYYY-mm') group by c.name, b.name ORDER BY c.name, b.name") 
        const cash = await pool.query("SELECT to_char(dateordered::date, 'MON-YY') AS month, ROUND(SUM(grandtotal)) AS total FROM adempiere.c_order WHERE docstatus = 'CO' AND c_doctype_id = '1000043' AND ad_client_id = '1000000' GROUP BY DATE_TRUNC('month', dateordered::date), to_char(dateordered::date, 'MON-YY') ORDER BY DATE_TRUNC('month', dateordered::date) DESC limit 12;")
        const ytd = await pool.query("select to_char(to_date(month, 'YYYY-MM'), 'MON-YY') AS month, ROUND(sum(amount)) as total from adempiere.af_daily_projection where elementid = '61120' group by to_char(to_date(month, 'YYYY-MM'), 'MON-YY'), to_date(month, 'YYYY-MM') ORDER by to_date(month, 'YYYY-MM') desc limit 12")
        //const collection = await pool.query("select c.name as grp, (sum(case WHEN a.isreceipt = 'Y' THEN a.payamt else 0 END) + sum(case WHEN a.isreceipt = 'N' THEN a.payamt * -1 else 0 END)) as Amt from adempiere.c_payment a left Join adempiere.c_bpartner b ON a.c_bpartner_id = b.c_bpartner_id left Join adempiere.c_bp_group c ON b.c_bp_group_id = c.c_bp_group_id where dateacct >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' AND a.dateacct < date_trunc('month', CURRENT_DATE) AND a.ad_client_id = '1000000' and a.c_bpartner_id is not null AND a.docstatus = ANY(ARRAY['CO', 'CL']) AND b.iscustomer = 'Y' AND b.c_bp_group_id != '1000028' GROUP BY c.name ORDER by c.name")
        res.send([{"card" : card.rows, "proj" : proj.rows, "chart" : chartdata.rows, "cash" : cash.rows, "ytd" : ytd.rows, "client" : client.rows, "site" : site.rows }])
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = router;