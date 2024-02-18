//import all the modules
let Mydatabase= require('./dbManagement/index')
const express = require('express')
const app = express()
const port = 3000

// initialize the database
let gaurav= new Mydatabase("oreno");
app.use(express.json())

// post the product into the database
app.post('/', (req, res) => {
    gaurav.createRecord('product',req.body)
    res.send(gaurav.readRecord("product",4))
})

// put the product into the database
app.put('/', (req, res) => {
    gaurav.updateRecord('product',4,req.body)
    res.send(gaurav.readRecord("product",4))
})

//get the product from database
app.get('/',(req,re))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

