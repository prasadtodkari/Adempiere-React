const express =  require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")
const port = 5000;


const apiRoute = require('./routes/Api')
const prodRoute = require('./routes/ProdApi')
const vendRoute = require('./routes/VendApi')
const saleRoute = require('./routes/SaleApi')

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    allowedHeaders: 'Origin, Content-Type, Accept', // Corrected to 'Content-Type'
    methods: ['GET', 'PUT']
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to Afozo Pvt Ltd - API")
})

app.use('/api', apiRoute)
app.use('/prodApi', prodRoute)
app.use('/vendApi', vendRoute)
app.use('/saleApi', saleRoute)


app.listen(port, () =>{
    console.log(`Server started on ${port}`)
})